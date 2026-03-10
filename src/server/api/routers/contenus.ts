import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const contenusRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ type: z.enum(["ARTICLE", "DOCUMENT"]).optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.contenu.findMany({
        where: {
          isPublished: true,
          ...(input.type ? { type: input.type } : {}),
        },
        select: {
          id: true,
          titre: true,
          type: true,
          createdAt: true,
          auteur: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.contenu.findFirst({
        where: { id: input.id, isPublished: true },
        select: {
          id: true,
          titre: true,
          corps: true,
          videoUrl: true,
          type: true,
          createdAt: true,
          auteur: { select: { name: true } },
        },
      });
    }),
});
