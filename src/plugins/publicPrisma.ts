import fp from "fastify-plugin";
import { PrismaClient } from "@prisma-public/prisma/client";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { helloRoutes } from "../routes/hello";
import { tenantCodeRoutes } from "../routes/tenant-code";
import { tenantsRoutes } from "../routes/tenants";
import { booksRoutes } from "../routes/books";

declare module "fastify" {
  interface FastifyInstance {
    publicPrisma: PrismaClient;
  }
}

const publicPrismaPlugin: FastifyPluginAsync = fp(
  async (server: FastifyInstance, options) => {
    const publicPrisma = new PrismaClient({
      log: ["error", "info", "query", "warn"],
    });

    server.decorate("publicPrisma", publicPrisma);

    server.addHook("onClose", async () => {
      await server.publicPrisma.$disconnect();
    });

    server.register(helloRoutes);
    server.register(tenantCodeRoutes);
    server.register(tenantsRoutes);
    server.register(booksRoutes);
  }
);

export default publicPrismaPlugin;
