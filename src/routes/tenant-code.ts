import { FastifyInstance } from 'fastify';

export async function tenantCodeRoutes(server: FastifyInstance) {
  server.get('/tenant-code', async (request, reply) => {
    return request.tenantCode;
  });
}