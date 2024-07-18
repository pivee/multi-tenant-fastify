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
  async (server: FastifyInstance, options) => {
    server.addHook("onResponse", async (request, reply) => {
      if (request.tenantPrisma) {
        await request.tenantPrisma?.$disconnect();
      }
    });
  }
);

export default tenantPrismaPlugin;
