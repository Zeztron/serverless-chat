import AWS, { ApiGatewayManagementApi } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

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
  }

  async getClients(connectionId: string): Promise<void> {
    const output = await this.docClient
      .scan({
        TableName: this.clientTable,
      })
      .promise();

    const clients = output.Items || [];

    await this.apiGateway
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(clients),
      })
      .promise();
  }
}
