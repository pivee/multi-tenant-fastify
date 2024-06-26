import { FastifyInstance } from 'fastify';

export async function usersRoutes(server: FastifyInstance) {
  server.get('/users', async (request, reply) => {
    const users = await request.tenantPrisma.user.findMany();

    return users;
  });
}