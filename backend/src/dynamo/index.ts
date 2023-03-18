import AWS, { AWSError, ApiGatewayManagementApi } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Client } from '../types';

export class DynamoClient {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly apiGateway: ApiGatewayManagementApi = new AWS.ApiGatewayManagementApi(
      {
        endpoint: process.env.WSSAPIGATEWAYENDPOINT!,
      }
    ),
    private readonly clientTable = process.env.CLIENTS_TABLE!,
    private readonly messagesTable = process.env.MESSAGES_TABLE!,
    private readonly userIndex = process.env.USER_INDEX!,
    private readonly userToUserIndex = process.env.USER_TO_USER_INDEX!
  ) {}

  async getAllClients(): Promise<Client[]> {
    const output = await this.docClient
      .scan({ TableName: this.clientTable })
      .promise();

    const clients = output.Items || [];

    return clients as Client[];
  }

  async postToConnection(connectionId: string, data: string): Promise<void> {
    try {
      await this.apiGateway
        .postToConnection({
          ConnectionId: connectionId,
          Data: data,
        })
        .promise();
    } catch (error) {
      if ((error as AWSError).statusCode !== 410) {
        throw error;
      }
      // We want to disconnect when the connection is stale
      await this.disconnect(connectionId);
    }
  }

  async notifyClients(connectionIdToExclude: string): Promise<void> {
    const clients: Client[] = await this.getAllClients();

    await Promise.all(
      clients
        .filter(
          (client: Client) => client.connectionId !== connectionIdToExclude
        )
        .map(async (client: Client) => {
          await this.postToConnection(
            client.connectionId,
            JSON.stringify(client)
          );
        })
    );
  }

  async connect(connectionId: string, name: string): Promise<void> {
    await this.docClient
      .put({
        TableName: this.clientTable,
        Item: {
          connectionId,
          name,
        },
      })
      .promise();

    await this.notifyClients(connectionId);
  }

  async disconnect(connectionId: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.clientTable,
        Key: {
          connectionId,
        },
      })
      .promise();

    await this.notifyClients(connectionId);
  }

  async getClients(connectionId: string): Promise<void> {
    const clients: Client[] = await this.getAllClients();

    await this.postToConnection(connectionId, JSON.stringify(clients));
  }
}
