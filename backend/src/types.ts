import { Key } from 'aws-sdk/clients/dynamodb';

export type Action =
  | '$connect'
  | '$disconnect'
  | 'getMessages'
  | 'sendMessage'
  | 'getClients';

export type Client = {
  connectionId: string;
  user: string;
};

export type Status = 'forbidden' | 'ok';

export type SendMessageBody = {
  message: string;
  recipient: string;
};

export type GetMessagesBody = {
  targetUser: string;
  limit: number;
  startKey: Key | undefined;
};
