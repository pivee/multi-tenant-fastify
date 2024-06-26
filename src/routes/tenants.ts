import { FastifyInstance } from 'fastify';

export async function tenantsRoutes(server: FastifyInstance) {
  server.get('/tenants', async (request, reply) => {
    const publicPrisma = server.publicPrisma;

    const tenants = await publicPrisma.tenant.findMany();

    return tenants;
  });
}