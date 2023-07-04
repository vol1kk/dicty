import { createTRPCRouter } from "~/server/api/trpc";
import { wordRouter } from "~/server/api/routers/wordRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  words: wordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
