import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const verifyPassword = (plainText: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(plainText, hashedPassword);
};
