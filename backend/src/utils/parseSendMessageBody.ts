import { SendMessageBody } from '../types';

export const parseSendMessageBody = (body: string | null): SendMessageBody => {
  const sendMessageBody: SendMessageBody = JSON.parse(body || '{}');

  if (
    !sendMessageBody ||
    typeof sendMessageBody.message !== 'string' ||
    typeof sendMessageBody.recipient !== 'string'
  ) {
    throw new Error('Incorrect SendMessageBody type');
  }
  return sendMessageBody;
};
