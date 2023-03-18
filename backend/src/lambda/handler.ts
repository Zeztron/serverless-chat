import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Action } from '../types';
import {
  handleConnect,
  handleDisconnect,
  handleGetClients,
  handleSendMessage,
} from '../actions';
import { parseMessageBody } from '../utils/parseMessageBody';

export const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId as string;
  const routeKey = event.requestContext.routeKey as Action;

  switch (routeKey) {
    case '$connect':
      return handleConnect(connectionId, event.queryStringParameters);
    case '$disconnect':
      return handleDisconnect(connectionId);
    case 'getClients':
      return handleGetClients(connectionId);
    case 'sendMessage':
      return handleSendMessage(connectionId, parseMessageBody(event.body));

    default:
      return {
        statusCode: 500,
        body: '',
      };
  }
};
