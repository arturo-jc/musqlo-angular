import { users } from "../auth/auth.resolvers"

async function getUserById(_root: any, args: any) {
  return users.find(u => u.id === args.userId);
}

export default {
  Query: {
    user: getUserById,
  },
}
