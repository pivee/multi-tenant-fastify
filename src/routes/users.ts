import { FastifyInstance } from 'fastify';

export async function usersRoutes(server: FastifyInstance) {
  server.get('/users', async (request, reply) => {
    const tenantPrisma = server.tenantPrisma;

    const users = await tenantPrisma.user.findMany();

    return users;
  });
}