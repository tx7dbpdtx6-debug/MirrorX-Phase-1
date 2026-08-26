---
name: Supported application stack
description: The monorepo's supported web and persistence choices for future MirrorX work.
---

MirrorX should continue on the workspace's React + Vite frontend, Express API, OpenAPI code generation, and Drizzle/PostgreSQL stack unless a deliberate migration is requested.

**Why:** The project template provisions these tools and its artifact/workflow routing expects them; introducing a separate Next.js/Prisma toolchain would create parallel conventions without helping the current product.

**How to apply:** Add new API surface to the OpenAPI spec first, regenerate shared clients, keep database tables under the shared Drizzle library, and keep the web app on its managed artifact workflow.