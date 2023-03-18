import { Client } from '../types';

export const createClientsMessage = (clients: Client[]): string => {
  return JSON.stringify({ type: 'clients', value: { clients } });
};
