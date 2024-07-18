import { PrismaClient as PublicPrismaClient } from "@prisma-public/prisma/client";
import { PrismaClient as TenantPrismaClient } from "@prisma-tenant/prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    publicPrisma: PublicPrismaClient;
  }

  interface FastifyRequest {
    tenantCode: string;
    tenantPrisma: TenantPrismaClient;
  }
}

export default async function tenantPrismaMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const tenantCode = request.headers["x-tenant-code"] as string;

  const publicPrisma = new PublicPrismaClient({
    log: ["error", "info", "query", "warn"],
  });

  const tenant = await publicPrisma.tenant.findFirst({
    where: { code: tenantCode },
    include: { datasource: true },
  });

  publicPrisma.$disconnect();

  const tenantPrisma = new TenantPrismaClient({
    log: ["error", "info", "query", "warn"],
    datasourceUrl: tenant?.datasource.url,
  });

  request.tenantPrisma = tenantPrisma;
}
