import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import { v1 as uuid } from 'uuid';
import jwt, { Algorithm, JsonWebTokenError } from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Context, TokenPayload } from '../context';
import { CookieOptions, Response } from 'express';
import { getCurrentTimeSeconds } from '../utils/time';

export const CUSTOM_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
};

export interface SignUpInput {
  email: string;
  password: string;
  username?: string;
}

export interface AuthenticateOutput {
  user: Omit<User, 'password'>;
  expiresIn?: number;
}

export interface LogInInput extends SignUpInput {}

export interface User extends SignUpInput {
  id: string;
}

let users: User[] = [];

async function signUp(_root: any, args: SignUpInput, ctx: Context): Promise<AuthenticateOutput> {
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

  const expiresIn = setToken(newUser, ctx.res);

  return {
    user: newUser,
    expiresIn,
  };
}

async function logIn(_root: any, args: LogInInput, ctx: Context): Promise<AuthenticateOutput> {
  const existingUser = users.find(u => u.email === args.email);

  if (!existingUser) {
    throw new GraphQLError('Invalid credentials', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  const isPasswordValid = await bcrypt.compare(args.password, existingUser.password);

  if (!isPasswordValid) {
    throw new GraphQLError('Invalid credentials', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  const expiresIn = setToken(existingUser, ctx.res);

  return {
    user: existingUser,
    expiresIn,
  };
}

async function authenticate(_root: any, _args: any, ctx: Context) {
  return users.find(u => u.id === ctx.userId);
}

async function logOut(_root: any, _args: any, ctx: Context) {
  ctx.res.clearCookie('token');
  return true;
}

function setToken(user: User, res: Response): number | undefined {

  const payload: TokenPayload = {
    userId: user.id,
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

  return expiresIn;
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

export default {
  Query: {
    logIn,
    authenticate,
  },
  Mutation: {
    signUp,
    logOut,
  },
}
