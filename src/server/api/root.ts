import { postRouter } from "@/server/api/routers/post";
import { contenusRouter } from "@/server/api/routers/contenus";
import { profilRouter } from "@/server/api/routers/profil";
import { exercicesRouter } from "@/server/api/routers/exercices";
import { adminUsersRouter } from "@/server/api/routers/admin/users";
import { adminContenusRouter } from "@/server/api/routers/admin/contenus";
import { adminExercicesRouter } from "@/server/api/routers/admin/exercices";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  contenus: contenusRouter,
  profil: profilRouter,
  exercices: exercicesRouter,
  adminUsers: adminUsersRouter,
  adminContenus: adminContenusRouter,
  adminExercices: adminExercicesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
