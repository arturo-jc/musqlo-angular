import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import { v1 as uuid } from 'uuid';
import jwt, { Algorithm, JsonWebTokenError } from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Context } from '../context';
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

async function signUp(_root: any, args: SignUpInput, ctx: Context): Promise<Omit<User, 'password'>> {
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

  setToken(newUser, ctx.res);

  return newUser;
}

function setToken(user: User, res: Response): void {
  const payload = {
    id: user.id,
  };

  const { secret, algorithm, expiresIn } = getJWTConfigs();

  let token: string | undefined = undefined;

  try {
    token = jwt.sign(payload, secret, { algorithm, expiresIn });
  } catch(e) {
    console.error((e as JsonWebTokenError).message);
  }

  if (!token) { return; }

  const opts: CookieOptions = {
    httpOnly: true,
    expires: dayjs().add(expiresIn, 's').toDate(),
  }

  res.cookie('token', token, opts);
}

export function getJWTConfigs() {
  const secret = process.env.JWT_SECRET;
  const algorithm = process.env.JWT_ALGORITHM as Algorithm | undefined;
  const lifetime = process.env.JWT_LIFETIME;

  if (!secret || !algorithm || !lifetime) {
    throw new Error('Could not resolve JWT configs');
  };

  return { secret, algorithm, expiresIn: Number(lifetime) };
}

async function logIn(_root: any, args: LogInInput): Promise<Omit<User, 'password'>> {
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
