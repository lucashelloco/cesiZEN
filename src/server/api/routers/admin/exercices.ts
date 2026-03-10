import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

const exerciceInput = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  nombreCycles: z.number().int().min(1),
  tempsInspiration: z.number().int().min(1),
  tempsApnee: z.number().int().min(0).default(0),
  tempsExpiration: z.number().int().min(1),
});

export const adminExercicesRouter = createTRPCRouter({
  listPresets: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.exerciceCardiaque.findMany({
      where: { isPreset: true },
      orderBy: { createdAt: "asc" },
    });
  }),

  create: adminProcedure
    .input(exerciceInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.exerciceCardiaque.create({
        data: { ...input, isPreset: true, userId: null },
      });
    }),

  update: adminProcedure
    .input(exerciceInput.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.exerciceCardiaque.update({ where: { id }, data });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.exerciceCardiaque.delete({ where: { id: input.id } });
    }),
});
