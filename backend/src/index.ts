import express from 'express';
import http from 'http';
import { typeDefs, resolvers } from './schema';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

export interface Context {
  hostname: string;
  res: express.Response;
}

async function start() {

  dotenv.config();

  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(
      server,
      {
        context: async ({ req, res }) => {

          const context: Context = {
            hostname: req.hostname,
            res,
          };

          return context;
        }
      }
    ),
  );

  const port = 4000;

  httpServer.listen({ port }, () => console.log(`Listening on ${port}`));
}

start();
