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

const FORBIDDEN = {
  statusCode: 403,
  body: '',
};

export async function handleConnect(
  connectionId: string,
  queryParams: APIGatewayProxyEventQueryStringParameters | null
): Promise<APIGatewayProxyResult> {
  if (!queryParams || !queryParams['user']) {
    return FORBIDDEN;
  }

  const connectionStatus = await dynamoClient.connect(
    connectionId,
    queryParams['user']!
  );

  if (connectionStatus === 'forbidden') return FORBIDDEN;

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
