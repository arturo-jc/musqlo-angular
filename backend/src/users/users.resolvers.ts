import { users } from "../auth/auth.resolvers"
import { Context } from "../context";
import { QueryResolvers, Resolvers, User } from "../generated/graphql.generated";

const getUserById: QueryResolvers['user'] = (_parent, args) => {
  const user =  users.find(u => u.id === args.userId);

  if (!user) { return null; }

  const userWithoutPassword: User = {
    id: user.id,
    email: user.email,
    username: user?.username,
  };

  return userWithoutPassword;
}

const resolvers: Resolvers<Context> = {
  Query: {
    user: getUserById,
  },
}

export default resolvers;
