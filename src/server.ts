import dotenv from 'dotenv';
import fastify from 'fastify';
import publicPrismaPlugin from './plugins/publicPrisma';
import tenantPrismaPlugin from './plugins/tenantPrisma';
import { helloRoutes } from './routes/hello';
import { tenantCodeRoutes } from './routes/tenant-code';
import { tenantsRoutes } from './routes/tenants';
import { usersRoutes } from './routes/users';

dotenv.config();

declare module "fastify" {
  interface FastifyRequest {
    tenantCode: string;
  }
}

const server = fastify({ logger: true });

server.register(publicPrismaPlugin);
server.register(tenantPrismaPlugin);

server.register(helloRoutes);
server.register(tenantCodeRoutes);
server.register(tenantsRoutes);
server.register(usersRoutes);

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