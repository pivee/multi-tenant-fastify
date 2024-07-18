import { FastifyInstance } from "fastify";

export async function booksRoutes(server: FastifyInstance) {
  server.get("/books", async (request, reply) => {
    try {
      const books = await request.tenantPrisma.user.findMany();

      return books;
    } catch (error) {
      console.error(error);
    }
  });
}
