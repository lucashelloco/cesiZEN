import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const contenusRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      offset: z.number().min(0).default(0),
      limit: z.number().min(1).max(90).default(90),
      sortBy: z.enum(["date-asc", "date-desc"]).default("date-desc"),
    }))
    .query(async ({ ctx, input }) => {
      const { search, offset, limit, sortBy } = input;

      const where = {
        isPublished: true,
        ...(search ? {
          OR: [
            { titre: { contains: search, mode: "insensitive" as const } },
            { corps: { contains: search, mode: "insensitive" as const } },
          ],
        } : {}),
      };

      const [contenus, total] = await Promise.all([
        ctx.db.contenu.findMany({
          where,
          select: {
            id: true,
            titre: true,
            type: true,
            createdAt: true,
            auteur: { select: { name: true } },
          },
          orderBy: { createdAt: sortBy === "date-asc" ? "asc" : "desc" },
          skip: offset,
          take: limit,
        }),
        ctx.db.contenu.count({ where }),
      ]);

      return { contenus, total };
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
