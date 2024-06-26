import fp from 'fastify-plugin';
import { PrismaClient } from "@prisma-public/prisma/client";
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

declare module "fastify" {
  interface FastifyInstance {
    publicPrisma: PrismaClient;
  }
}

const publicPrismaPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance, options) => {
  const publicPrisma = new PrismaClient({ log: ["error", "info", "query", "warn"] });

  server.decorate("publicPrisma", publicPrisma);

  server.addHook("onClose", async () => {
    await server.publicPrisma.$disconnect();
  });
});

export default publicPrismaPlugin;
