import {
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { DynamoClient } from '../dynamo';

const dynamoClient = new DynamoClient();

const OK_RESPONSE = {
  statusCode: 200,
  body: '',
};

export async function handleConnect(
  connectionId: string,
  queryParams: APIGatewayProxyEventQueryStringParameters | null
): Promise<APIGatewayProxyResult> {
  if (!queryParams || !queryParams['user']) {
    return {
      statusCode: 403,
      body: '',
    };
  }

  await dynamoClient.connect(connectionId, queryParams['name']!);

  return OK_RESPONSE;
}

export async function handleDisconnect(
  connectionId: string
): Promise<APIGatewayProxyResult> {
  await dynamoClient.disconnect(connectionId);

  return OK_RESPONSE;
}

export async function handleGetClients(
  connectionId: string
): Promise<APIGatewayProxyResult> {
  await dynamoClient.getClients(connectionId);

  return OK_RESPONSE;
}
