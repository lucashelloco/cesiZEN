import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const profilRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }),

  update: protectedProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name, email: input.email },
      });
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.delete({ where: { id: ctx.session.user.id } });
  }),
});
