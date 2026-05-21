import { describe, it, expect, vi, beforeEach } from "vitest";
import { contenusRouter } from "@/server/api/routers/contenus";
import { createCallerFactory } from "@/server/api/trpc";

const createCaller = createCallerFactory(contenusRouter);

const mockDb = {
  contenu: {
    findMany: vi.fn(),
    count: vi.fn(),
    findFirst: vi.fn(),
  },
};

function makeCtx() {
  return { db: mockDb as never, session: null, headers: new Headers() };
}

beforeEach(() => vi.clearAllMocks());

describe("contenusRouter.list", () => {
  it("retourne les contenus publiés avec le total", async () => {
    const fakeContenus = [
      { id: "1", titre: "Article test", type: "ARTICLE", createdAt: new Date(), auteur: { name: "Admin" } },
    ];
    mockDb.contenu.findMany.mockResolvedValue(fakeContenus);
    mockDb.contenu.count.mockResolvedValue(1);

    const caller = createCaller(makeCtx());
    const result = await caller.list({});

    expect(result.contenus).toEqual(fakeContenus);
    expect(result.total).toBe(1);
  });

  it("filtre uniquement les contenus isPublished:true", async () => {
    mockDb.contenu.findMany.mockResolvedValue([]);
    mockDb.contenu.count.mockResolvedValue(0);

    const caller = createCaller(makeCtx());
    await caller.list({});

    expect(mockDb.contenu.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isPublished: true }),
      })
    );
  });

  it("applique le filtre de recherche sur titre et corps", async () => {
    mockDb.contenu.findMany.mockResolvedValue([]);
    mockDb.contenu.count.mockResolvedValue(0);

    const caller = createCaller(makeCtx());
    await caller.list({ search: "méditation" });

    expect(mockDb.contenu.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ titre: expect.objectContaining({ contains: "méditation" }) }),
            expect.objectContaining({ corps: expect.objectContaining({ contains: "méditation" }) }),
          ]),
        }),
      })
    );
  });

  it("applique offset et limit pour la pagination", async () => {
    mockDb.contenu.findMany.mockResolvedValue([]);
    mockDb.contenu.count.mockResolvedValue(20);

    const caller = createCaller(makeCtx());
    await caller.list({ offset: 10, limit: 5 });

    expect(mockDb.contenu.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 5 })
    );
  });

  it("trie par date décroissante par défaut", async () => {
    mockDb.contenu.findMany.mockResolvedValue([]);
    mockDb.contenu.count.mockResolvedValue(0);

    const caller = createCaller(makeCtx());
    await caller.list({});

    expect(mockDb.contenu.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "desc" } })
    );
  });

  it("trie par date croissante si sortBy=date-asc", async () => {
    mockDb.contenu.findMany.mockResolvedValue([]);
    mockDb.contenu.count.mockResolvedValue(0);

    const caller = createCaller(makeCtx());
    await caller.list({ sortBy: "date-asc" });

    expect(mockDb.contenu.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } })
    );
  });

  it("rejette un limit > 90 (validation Zod)", async () => {
    const caller = createCaller(makeCtx());
    await expect(caller.list({ limit: 200 })).rejects.toThrow();
  });
});

describe("contenusRouter.byId", () => {
  it("retourne le contenu correspondant à l'id", async () => {
    const fakeContenu = {
      id: "abc",
      titre: "Test",
      corps: "Corps du contenu",
      videoUrl: null,
      type: "ARTICLE",
      createdAt: new Date(),
      auteur: { name: "Admin" },
    };
    mockDb.contenu.findFirst.mockResolvedValue(fakeContenu);

    const caller = createCaller(makeCtx());
    const result = await caller.byId({ id: "abc" });

    expect(result).toEqual(fakeContenu);
    expect(mockDb.contenu.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "abc", isPublished: true },
      })
    );
  });

  it("retourne null si le contenu n'existe pas", async () => {
    mockDb.contenu.findFirst.mockResolvedValue(null);

    const caller = createCaller(makeCtx());
    const result = await caller.byId({ id: "inexistant" });

    expect(result).toBeNull();
  });
});
