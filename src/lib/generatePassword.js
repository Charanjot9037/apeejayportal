import crypto from 'crypto';

export const generateTemporaryPassword = () => {
  const randomPart = crypto
    .randomBytes(6)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '');

  return `Stu@${randomPart}`;
};
