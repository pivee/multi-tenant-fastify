import fastify, { FastifyRequest } from 'fastify';
import { helloRoutes } from './routes/hello';
import { tenantCodeRoutes } from './routes/tenant-code';

declare module "fastify" {
  interface FastifyRequest {
    tenantCode: string;
  }
}

const server = fastify({ logger: true });

server.addHook("preHandler", (request: FastifyRequest, reply, done) => {
  const tenantCode = request.headers["x-tenant-code"] as string;

  console.log("🪝 Tenant Code: ", tenantCode);

  request.tenantCode = tenantCode;

  done();
})

server.register(helloRoutes);
server.register(tenantCodeRoutes);

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