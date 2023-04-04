import express from 'express';
import { createHandler } from 'graphql-http';
import { schema } from './schema';

const app = express();

app.all('/graphql', createHandler({ schema }));

app.listen(3000, () => console.log('Listening...'));
