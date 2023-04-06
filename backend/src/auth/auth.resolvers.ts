import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';

export interface SignUpInput {
  email: string;
  password: string;
  username?: string;
}

export const CUSTOM_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
};

export interface LogInInput extends SignUpInput {}

export interface User extends SignUpInput {}

let users: User[] = [];

async function signUp(root: any, args: SignUpInput) {
  const existingUser = users.find(u => u.email === args.email);

  if (existingUser) {
    throw new GraphQLError('This email is already in use', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(args.password, salt);

  const newUser: User = {
    ...args,
    password: hash,
  };

  users = [ ...users, newUser ];

  return true;
}

async function logIn(root: any, args: LogInInput) {
  const existingUser = users.find(u => u.email === args.email);

  if (!existingUser) {
    throw new GraphQLError('Invalid credentials', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  const isPasswordValid = await bcrypt.compare(args.password, existingUser.password);

  if (!isPasswordValid) {
    throw new GraphQLError('Invalid credentials', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  return true;
}

export default {
  Query: {
    logIn,
  },
  Mutation: {
    signUp,
  },
}
