import dotenv from "dotenv";
import fastify from "fastify";
import publicPrismaPlugin from "./plugins/publicPrisma";
import tenantPrismaPlugin from "./plugins/tenantPrisma";

dotenv.config();

declare module "fastify" {
  interface FastifyRequest {
    tenantCode: string;
  }
}

const server = fastify({ logger: true });

server.register(publicPrismaPlugin);
server.register(tenantPrismaPlugin);

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log(`🔥 Server listening at http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
