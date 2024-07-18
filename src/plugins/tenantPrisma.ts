import { PrismaClient } from "@prisma-tenant/prisma/client";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyRequest {
    tenantCode: string;
    tenantPrisma: PrismaClient;
  }
}

const tenantPrismaPlugin: FastifyPluginAsync = fp(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (server: FastifyInstance, _options) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    server.addHook("onResponse", async (request, _reply) => {
      if (request.tenantPrisma) {
        await request.tenantPrisma?.$disconnect();
      }
    });
  }
);

export default tenantPrismaPlugin;
