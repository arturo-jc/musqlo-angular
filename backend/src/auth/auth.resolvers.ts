import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import { v1 as uuid } from 'uuid';
import jwt, { Algorithm, JsonWebTokenError } from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Context, TokenPayload } from '../context';
import { CookieOptions, Response } from 'express';
import { QueryResolvers, MutationResolvers, Resolvers, MutationSignUpArgs } from '../generated/graphql.generated';

export const CUSTOM_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
};

export interface RegisteredUser extends MutationSignUpArgs {
  id: string;
};

export let users: RegisteredUser[] = [];

const signUp: MutationResolvers<Context>['signUp'] = async (_parent, args, ctx) => {
  const existingUser = users.find(u => u.email === args.email);

  if (existingUser) {
    throw new GraphQLError('This email is already in use', { extensions: { code: CUSTOM_ERROR_CODES.INVALID_CREDENTIALS }});
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(args.password, salt);

  const newUser: RegisteredUser = {
    ...args,
    password: hash,
    id: uuid(),
  };

  users = [ ...users, newUser ];

  const expiresIn = setToken(newUser, ctx.res);

  return {
    userId: newUser.id,
    userEmail: newUser.email,
    username: newUser.username,
    expiresIn,
  };
}

const logIn: QueryResolvers<Context>['logIn'] = async (_parent, args, ctx) => {
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
    userId: existingUser.id,
    userEmail: existingUser.email,
    username: existingUser.username,
    expiresIn,
  };
}

const authenticate: QueryResolvers<Context>['authenticate'] = async (_parent, _args, ctx) => {
  const user = users.find(u => u.id === ctx.userId);

  if (!user) { return null; }

  return {
    userId: user.id,
    userEmail: user.email,
    username: user.username,
    expiresIn: ctx.exp,
  };
}

const logOut: QueryResolvers<Context>['logOut'] = async (_parent, _args, ctx) => {
  ctx.res.clearCookie('token');
  return true;
}

function setToken(user: RegisteredUser, res: Response): number | undefined {

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

const resolvers: Resolvers<Context> = {
  Query: {
    logIn,
    authenticate,
    logOut,
  },
  Mutation: {
    signUp,
  },
}

export default resolvers;
