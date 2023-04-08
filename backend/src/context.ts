import { BaseContext, ContextFunction } from "@apollo/server";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { getJWTConfigs } from "./auth/auth.resolvers";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { Response } from 'express';

export interface Context {
  res: Response;
}

export const context: ContextFunction<[ExpressContextFunctionArgument], BaseContext> = async ({ req, res }) => {

  if (req.cookies?.token) {
    const { token } = req.cookies;
    const { secret, algorithm } = getJWTConfigs();

    let payload: string | JwtPayload;

    try {
      payload = token.verify(token, secret, { algorithms: [ algorithm ]});
    } catch(e) {
      console.error((e as JsonWebTokenError).message);
    }
  }

  const context: Context = {
    res,
  };

  return context;

};
