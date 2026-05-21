import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { exercicesRouter } from "@/server/api/routers/exercices";
import { createCallerFactory } from "@/server/api/trpc";

const createCaller = createCallerFactory(exercicesRouter);

const mockDb = {
  exerciceCardiaque: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
};

const validConfig = {
  nom: "Cohérence cardiaque",
  nombreCycles: 5,
  tempsInspiration: 5,
  tempsApnee: 0,
  tempsExpiration: 5,
};

function makeCtx(session: unknown = null) {
  return { db: mockDb as never, session, headers: new Headers() };
}

function makeSession(userId = "user-1") {
  return { user: { id: userId, name: "Test", email: "test@test.com" }, session: {} };
}

beforeEach(() => vi.clearAllMocks());

describe("exercicesRouter.getPresets", () => {
  it("retourne la liste des presets triés par date", async () => {
    const presets = [
      { id: "1", nom: "Cohérence cardiaque 5-0-5", nombreCycles: 5, tempsInspiration: 5, tempsApnee: 0, tempsExpiration: 5, isPreset: true, createdAt: new Date() },
      { id: "2", nom: "Box breathing 4-4-4-4", nombreCycles: 4, tempsInspiration: 4, tempsApnee: 4, tempsExpiration: 4, isPreset: true, createdAt: new Date() },
    ];
    mockDb.exerciceCardiaque.findMany.mockResolvedValue(presets);

    const caller = createCaller(makeCtx());
    const result = await caller.getPresets();

    expect(result).toEqual(presets);
    expect(mockDb.exerciceCardiaque.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPreset: true },
        orderBy: { createdAt: "asc" },
      })
    );
  });

  it("retourne un tableau vide si aucun preset", async () => {
    mockDb.exerciceCardiaque.findMany.mockResolvedValue([]);

    const caller = createCaller(makeCtx());
    const result = await caller.getPresets();

    expect(result).toEqual([]);
  });
});

describe("exercicesRouter.getUserConfig", () => {
  it("rejette un utilisateur non authentifié", async () => {
    const caller = createCaller(makeCtx(null));
    await expect(caller.getUserConfig()).rejects.toThrow(TRPCError);
  });

  it("retourne la config personnalisée de l'utilisateur", async () => {
    const config = { id: "cfg-1", nom: "Ma config", nombreCycles: 3, tempsInspiration: 4, tempsApnee: 0, tempsExpiration: 6, isPreset: false, userId: "user-1", createdAt: new Date(), updatedAt: new Date() };
    mockDb.exerciceCardiaque.findFirst.mockResolvedValue(config);

    const caller = createCaller(makeCtx(makeSession("user-1")));
    const result = await caller.getUserConfig();

    expect(result).toEqual(config);
    expect(mockDb.exerciceCardiaque.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1", isPreset: false },
      })
    );
  });
});

describe("exercicesRouter.saveUserConfig", () => {
  it("rejette un utilisateur non authentifié", async () => {
    const caller = createCaller(makeCtx(null));
    await expect(caller.saveUserConfig(validConfig)).rejects.toThrow(TRPCError);
  });

  it("crée une nouvelle config si aucune n'existe", async () => {
    mockDb.exerciceCardiaque.findFirst.mockResolvedValue(null);
    mockDb.exerciceCardiaque.create.mockResolvedValue({ id: "new", ...validConfig });

    const caller = createCaller(makeCtx(makeSession("user-1")));
    await caller.saveUserConfig(validConfig);

    expect(mockDb.exerciceCardiaque.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ ...validConfig, isPreset: false, userId: "user-1" }),
      })
    );
    expect(mockDb.exerciceCardiaque.update).not.toHaveBeenCalled();
  });

  it("met à jour la config existante sans en créer une nouvelle", async () => {
    mockDb.exerciceCardiaque.findFirst.mockResolvedValue({ id: "existing" });
    mockDb.exerciceCardiaque.update.mockResolvedValue({ id: "existing" });

    const caller = createCaller(makeCtx(makeSession("user-1")));
    await caller.saveUserConfig({ ...validConfig, nom: "Config modifiée" });

    expect(mockDb.exerciceCardiaque.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "existing" } })
    );
    expect(mockDb.exerciceCardiaque.create).not.toHaveBeenCalled();
  });

  it("rejette tempsInspiration < 1 (validation Zod)", async () => {
    const caller = createCaller(makeCtx(makeSession()));
    await expect(
      caller.saveUserConfig({ ...validConfig, tempsInspiration: 0 })
    ).rejects.toThrow();
  });

  it("rejette tempsApnee < 0 (validation Zod)", async () => {
    const caller = createCaller(makeCtx(makeSession()));
    await expect(
      caller.saveUserConfig({ ...validConfig, tempsApnee: -1 })
    ).rejects.toThrow();
  });
});
