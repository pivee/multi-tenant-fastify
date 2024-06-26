import fastify, { FastifyRequest } from 'fastify';

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

server.get('/hello', async (request, reply) => {
  return "Hello World!";
});

server.get('/tenant-code', async (request, reply) => {
  return request.tenantCode;
});

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