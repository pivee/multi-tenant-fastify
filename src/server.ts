import fastify from 'fastify';

const server = fastify({ logger: true });

server.get('/hello', async (request, reply) => {
  return "Hello World!";
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