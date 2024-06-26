import { FastifyInstance } from 'fastify';

export async function helloRoutes(server: FastifyInstance) {
  server.get('/hello', async (request, reply) => {
    return "Hello World!";
  });
}