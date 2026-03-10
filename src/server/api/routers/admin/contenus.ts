import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

const contenuInput = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  corps: z.string().min(1, "Le contenu est requis"),
  videoUrl: z.string().url().optional().or(z.literal("")),
  type: z.enum(["ARTICLE", "DOCUMENT"]),
  isPublished: z.boolean().default(false),
});

export const adminContenusRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.contenu.findMany({
      include: { auteur: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: adminProcedure
    .input(contenuInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contenu.create({
        data: { ...input, auteurId: ctx.session.user.id },
      });
    }),

  update: adminProcedure
    .input(contenuInput.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.contenu.update({ where: { id }, data });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contenu.delete({ where: { id: input.id } });
    }),

  togglePublish: adminProcedure
    .input(z.object({ id: z.string(), isPublished: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contenu.update({
        where: { id: input.id },
        data: { isPublished: input.isPublished },
      });
    }),
});
