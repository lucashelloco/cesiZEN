import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

export const adminUsersRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { contenus: true, exercices: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  setRole: adminProcedure
    .input(z.object({ userId: z.string(), role: z.enum(["USER", "ADMIN"]) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),

  toggleActive: adminProcedure
    .input(z.object({ userId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.userId },
        data: { isActive: input.isActive },
      });
    }),
});
