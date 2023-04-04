import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'path';

const typeDefsArray = loadFilesSync(path.join(__dirname, './**/*.graphql'));
const resolversArray = loadFilesSync(path.join(__dirname, './**/*.resolvers.ts'));

export const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs(typeDefsArray),
  resolvers: mergeResolvers(resolversArray),
});;
