import { BaseContext, ContextFunction } from "@apollo/server";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { getJWTConfigs } from "./auth/auth.resolvers";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { Response } from 'express';

export interface Context {
  res: Response;
  userId?: string;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export const context: ContextFunction<[ExpressContextFunctionArgument], BaseContext> = async ({ req, res }) => {

  const payload = verifyToken(req.cookies?.token);

  const context: Context = {
    res,
    userId: payload?.userId,
  };

  return context;

};

function verifyToken(token?: string): TokenPayload | undefined {

  if (!token) { return; }

  let payload: TokenPayload | undefined = undefined;

  const { secret, algorithm } = getJWTConfigs();

  try {
    payload = jwt.verify(token, secret, { algorithms: [ algorithm ]}) as TokenPayload;
  } catch(e) {
    console.error((e as JsonWebTokenError).message);
  }

  return payload;

}
