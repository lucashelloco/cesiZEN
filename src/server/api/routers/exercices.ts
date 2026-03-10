import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

const configInput = z.object({
  nom: z.string().min(1),
  nombreCycles: z.number().int().min(1),
  tempsInspiration: z.number().int().min(1),
  tempsApnee: z.number().int().min(0),
  tempsExpiration: z.number().int().min(1),
});

export const exercicesRouter = createTRPCRouter({
  getPresets: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.exerciceCardiaque.findMany({
      where: { isPreset: true },
      orderBy: { createdAt: "asc" },
    });
  }),

  getUserConfig: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.exerciceCardiaque.findFirst({
      where: { userId: ctx.session.user.id, isPreset: false },
      orderBy: { updatedAt: "desc" },
    });
  }),

  saveUserConfig: protectedProcedure
    .input(configInput)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.exerciceCardiaque.findFirst({
        where: { userId: ctx.session.user.id, isPreset: false },
      });

      if (existing) {
        return ctx.db.exerciceCardiaque.update({
          where: { id: existing.id },
          data: input,
        });
      }

      return ctx.db.exerciceCardiaque.create({
        data: { ...input, isPreset: false, userId: ctx.session.user.id },
      });
    }),
});
