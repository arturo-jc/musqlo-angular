import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import { v1 as uuid } from 'uuid';
import * as jsonWebToken from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Context } from '../index';
import { CookieOptions, Response } from 'express';

export const CUSTOM_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
};

export interface SignUpInput {
  email: string;
  password: string;
  username?: string;
}

export interface LogInInput extends SignUpInput {}

export interface User extends SignUpInput {
  id: string;
}

let users: User[] = [];

async function signUp(root: any, args: SignUpInput, ctx: Context): Promise<Omit<User, 'password'>> {
  const existingUser = users.find(u => u.email === args.email);

  if (existingUser) {
    throw new GraphQLError('This email is already in use', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(args.password, salt);

  const newUser: User = {
    ...args,
    password: hash,
    id: uuid(),
  };

  users = [ ...users, newUser ];

  setJWT(newUser, ctx.res);

  return newUser;
}

function setJWT(user: User, res: Response): void {
  const payload = {
    id: user.id,
  };

  const { secret, algorithm, expiresIn } = getJWTConfigs();

  const jwt = jsonWebToken.sign(payload, secret, { algorithm, expiresIn });

  const opts: CookieOptions = {
    httpOnly: true,
    expires: dayjs().add(expiresIn, 's').toDate(),
  }

  res.cookie('jwt', jwt, opts);
}

export function getJWTConfigs() {
  const secret = process.env.JWT_SECRET;
  const algorithm = process.env.JWT_ALGORITHM as jsonWebToken.Algorithm | undefined;
  const expiresIn = process.env.JWT_EXPIRES_IN as number | undefined;

  if (!secret || !algorithm || !expiresIn) {
    throw new Error('Could not resolve JWT configs');
  };

  return { secret, algorithm, expiresIn };
}

async function logIn(root: any, args: LogInInput): Promise<Omit<User, 'password'>> {
  const existingUser = users.find(u => u.email === args.email);

  if (!existingUser) {
    throw new GraphQLError('Invalid credentials', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  const isPasswordValid = await bcrypt.compare(args.password, existingUser.password);

  if (!isPasswordValid) {
    throw new GraphQLError('Invalid credentials', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  return existingUser;
}

export default {
  Query: {
    logIn,
  },
  Mutation: {
    signUp,
  },
}
