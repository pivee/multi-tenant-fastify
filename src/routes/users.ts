import { FastifyInstance } from "fastify";
import tenantPrismaMiddleware from "../middleware/tenantPrisma";

export async function usersRoutes(server: FastifyInstance) {
  server.route({
    method: "GET",
    url: "/users",
    preHandler: [tenantPrismaMiddleware],
    handler: async (request, reply) => {
      const users = await request.tenantPrisma.user.findMany();

      return users;
    },
  });
}
