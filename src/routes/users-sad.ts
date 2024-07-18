import { FastifyInstance } from "fastify";
import tenantPrismaMiddleware from "../middleware/tenantPrisma";

export async function usersSadRouter(server: FastifyInstance) {
  server.route({
    method: "GET",
    url: "/users-sad",
    // preHandler: [tenantPrismaMiddleware],
    handler: async (request, reply) => {
      try {
        const users = await request.tenantPrisma.user.findMany();

        return users;
      } catch (error) {
        throw new Error("Cannot access TenantPrismaClient");
      }
    },
  });
}
