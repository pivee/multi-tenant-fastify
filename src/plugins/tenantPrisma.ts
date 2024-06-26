import fp from 'fastify-plugin';
import { PrismaClient } from "@prisma-tenant/prisma/client";
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

declare module "fastify" {
  interface FastifyInstance {
    tenantPrisma: PrismaClient;
  }
}

const tenantPrismaPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance, options) => {
  const tenantPrisma = new PrismaClient({ 
    log: ["error", "info", "query", "warn"],
    datasourceUrl: `postgresql://postgres:qweqwe@localhost:5432/sandbox?schema=tenant_a` // WIP:
   });

  server.decorate("tenantPrisma", tenantPrisma);

  server.addHook("onClose", async () => {
    await server.tenantPrisma.$disconnect();
  });
});

export default tenantPrismaPlugin;
