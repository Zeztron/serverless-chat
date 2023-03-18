export type Action =
  | '$connect'
  | '$disconnect'
  | 'getMessages'
  | 'setMessage'
  | 'getClients';

export type Client = {
  connectionId: string;
  user: string;
};

export type Status = 'forbidden' | 'ok';
