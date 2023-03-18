export type Action =
  | '$connect'
  | '$disconnect'
  | 'getMessages'
  | 'setMEssage'
  | 'getClients';

export type Client = {
  connectionId: string;
  name: string;
};
