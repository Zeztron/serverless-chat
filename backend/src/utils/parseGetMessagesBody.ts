import { GetMessagesBody } from '../types';

export const parseGetMessagesBody = (body: string | null): GetMessagesBody => {
  const getMessagesBody: GetMessagesBody = JSON.parse(body || '{}');

  if (
    !getMessagesBody ||
    typeof getMessagesBody.targetUser !== 'string' ||
    typeof getMessagesBody.limit !== 'number'
  ) {
    throw new Error('Incorrect GetMessagesBody type');
  }

  return getMessagesBody;
};
