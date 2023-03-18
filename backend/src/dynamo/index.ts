import AWS, { AWSError, ApiGatewayManagementApi } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Client, Status } from '../types';
import { createClientsMessage } from '../utils/createClientsMessage';

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

  private async getAllClients(): Promise<Client[]> {
    const output = await this.docClient
      .scan({ TableName: this.clientTable })
      .promise();

    const clients = output.Items || [];

    return clients as Client[];
  }

  private async postToConnection(
    connectionId: string,
    data: string
  ): Promise<boolean> {
    try {
      await this.apiGateway
        .postToConnection({
          ConnectionId: connectionId,
          Data: data,
        })
        .promise();

      return true;
    } catch (error) {
      if ((error as AWSError).statusCode !== 410) {
        throw error;
      }
      // We want to disconnect when the connection is stale
      await this.disconnect(connectionId);

      return false;
    }
  }

  private async notifyClients(connectionIdToExclude: string): Promise<void> {
    const clients: Client[] = await this.getAllClients();

    await Promise.all(
      clients
        .filter(
          (client: Client) => client.connectionId !== connectionIdToExclude
        )
        .map(async (client: Client) => {
          await this.postToConnection(
            client.connectionId,
            createClientsMessage(clients)
          );
        })
    );
  }

  private async lookForUser(user: string) {
    // Look for same name to prevent impersonations.
    const output = await this.docClient
      .query({
        TableName: this.clientTable,
        IndexName: this.userIndex,
        KeyConditionExpression: '#user = :user',
        ExpressionAttributeNames: {
          '#user': 'user',
        },
        ExpressionAttributeValues: {
          ':user': user,
        },
      })
      .promise();

    return output;
  }

  public async connect(connectionId: string, user: string): Promise<Status> {
    // Look for user to check if that user already exists.
    const output = await this.lookForUser(user);

    if (output.Count && output.Count > 0) {
      const client = (output.Items as Client[])[0];

      if (
        await this.postToConnection(
          client.connectionId,
          JSON.stringify({ type: 'ping' })
        )
      ) {
        return 'forbidden';
      }
    }

    await this.docClient
      .put({
        TableName: this.clientTable,
        Item: {
          connectionId,
          user,
        },
      })
      .promise();

    await this.notifyClients(connectionId);

    return 'ok';
  }

  public async disconnect(connectionId: string): Promise<void> {
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

  public async getClients(connectionId: string): Promise<void> {
    const clients: Client[] = await this.getAllClients();

    await this.postToConnection(connectionId, createClientsMessage(clients));
  }
}
