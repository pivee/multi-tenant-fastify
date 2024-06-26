# Muti-tenant Fastify

This is a starter kit for creating multi-tenant fastify APIs using Prisma and PostgreSQL.

## How to run locally

### 1. Create `./.env` file

```txt
CATALOG_DATABASE_URL="postgresql://postgres:password@localhost:5432/database?schema=public"
TENANT_DATABASE_URL="postgresql://postgres:password@localhost:5432/database?schema=tenant"
```

Update the database URLs as required. If the database instances do not contain the right schema, you can create that using `pnpm db:push:public` and `pnpm db:push:tenant` once the dependencies are ready.

### 2. Install dependencies

```bash
pnpm install
```

Once the installation completes, `postinstall` should generate the PrismaClients.

### 3. Run `dev` or `start`

```bash
pnpm dev
```

```bash
pnpm start
```

## How to update database schema

There are two `.prisma` files inside `./prisma/`.

- `public-schema.prisma` for the Catalog Database
- `tenant-schema.prisma` for the Tenant Database

Do the necessary changes in the appropriate file and run the correct script.

### Schema changes on the Catalog Database

```bash
pnpm db:push:public
```

### Schema changes on the Tenant Database

```bash
pnpm db:push:tenant
```

## How to use the PrismaClient inside Fastify Application

### `publicPrisma`

This is used to access the catalog database.

```ts
import fp from 'fastify-plugin';
import { PrismaClient } from "@prisma-public/prisma/client";
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const publicPrismaPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance, options) => {
  const publicPrisma = new PrismaClient({ log: ["error", "info", "query", "warn"] });

  server.decorate("publicPrisma", publicPrisma);

  server.addHook("onClose", async () => {
    await server.publicPrisma.$disconnect();
  });
});

export default publicPrismaPlugin;

```

```ts
> Example:

export async function tenantsRoutes(server: FastifyInstance) {
  server.get('/tenants', async (request, reply) => {
    const publicPrisma = server.publicPrisma;

    const tenants = await publicPrisma.tenant.findMany();

    return tenants;
  });
}
```

### `tenantPrisma`

This is used to access the tenant-specific database.

```ts
import { PrismaClient } from "@prisma-tenant/prisma/client";
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const tenantPrismaPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance, options) => {
  server.decorateRequest("tenantPrisma", null);

  server.addHook("onRequest", async (request, reply) => {
    const tenantCode = request.headers["x-tenant-code"] as string;

    const tenant = await server.publicPrisma.tenant.findFirst({
      where: { code: tenantCode },
      include: { datasource: true }
    });

    const tenantPrisma = new PrismaClient({
      log: ["error", "info", "query", "warn"],
      datasourceUrl: tenant?.datasource.url
    });

    request.tenantPrisma = tenantPrisma;
  });

  server.addHook("onResponse", async (request, reply) => {
    await request.tenantPrisma.$disconnect();
  });
});

export default tenantPrismaPlugin;
```

```ts
> Example:

export async function usersRoutes(server: FastifyInstance) {
  server.get('/users', async (request, reply) => {
    const users = await request.tenantPrisma.user.findMany();

    return users;
  });
}
```

## Diagrams

### Entity Relationship

```mermaid
erDiagram
    CatalogDB--Tenant {
        int id PK
        string code
        string name
        int datasourceId FK
    }
    CatalogDB--Datasource {
        int id PK
        string url
    }
    TenantDB--User {
        int id PK
        string name
    }
    CatalogDB--Tenant ||--o| CatalogDB--Datasource : has
    CatalogDB--Tenant ||--o{ TenantDB--User : has
```
