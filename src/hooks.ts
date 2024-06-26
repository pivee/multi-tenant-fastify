import { FastifyInstance, FastifyRequest } from 'fastify';

export async function registerHooks(server: FastifyInstance) {
  server.addHook("preHandler", (request: FastifyRequest, reply, done) => {
    const tenantCode = request.headers["x-tenant-code"] as string;
  
    console.log("🪝 Tenant Code: ", tenantCode);
  
    request.tenantCode = tenantCode;
  
    done();
  })
}