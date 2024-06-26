import { PrismaClient } from "@prisma-tenant/prisma/client";
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

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

    const tenant = await server.publicPrisma.tenant.findFirst({
      where: { code: tenantCode },
      include: { datasource: true }
    });

    const tenantPrisma = new PrismaClient({
      log: ["error", "info", "query", "warn"],
      datasourceUrl: tenant?.datasource.url
    });

    request.tenantPrisma = tenantPrisma;
  });

  server.addHook("onResponse", async (request, reply) => {
    await request.tenantPrisma.$disconnect();
  });
});

export default tenantPrismaPlugin;
