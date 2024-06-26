import fp from 'fastify-plugin';
import { PrismaClient } from "@prisma-tenant/prisma/client";
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

declare module "fastify" {
  interface FastifyRequest {
    tenantCode: string;
    tenantPrisma: PrismaClient;
  }
}

const tenantPrismaPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance, options) => {
  server.decorateRequest("tenantPrisma", null);

  server.addHook("onRequest", async (request, reply) => {
    const tenantCode = request.headers["x-tenant-code"] as string;

    const tenantPrisma = new PrismaClient({
      log: ["error", "info", "query", "warn"],
      datasourceUrl: `postgresql://postgres:qweqwe@localhost:5432/sandbox?schema=${tenantCode}`
    });

    request.tenantPrisma = tenantPrisma;
  });

  server.addHook("onResponse", async (request, reply) => {
    await request.tenantPrisma.$disconnect();
  });
});

export default tenantPrismaPlugin;
