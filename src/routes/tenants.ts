import { FastifyInstance } from 'fastify';
import { PrismaClient } from "@prisma-public/prisma/client";

export async function tenantsRoutes(server: FastifyInstance) {
  server.get('/tenants', async (request, reply) => {
    const publicPrisma = new PrismaClient({ log: ["error", "info", "query", "warn"] });

    publicPrisma.$connect();

    const tenants = await publicPrisma.tenant.findMany();

    return tenants;
  });
}