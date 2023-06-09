import express from 'express';
import http from 'http';
import { typeDefs, resolvers } from './schema';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { context } from './context';

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
    cookieParser(),
    cors(),
    bodyParser.json(),
    expressMiddleware(server, { context }),
  );

  const port = 4000;

  httpServer.listen({ port }, () => console.log(`Listening on ${port} 🚀`));
}

start();
