import { describe, it, expect } from "vitest";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

describe("getYoutubeEmbedUrl", () => {
  it("transforme une URL youtube.com/watch en URL embed", () => {
    const result = getYoutubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(result).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("transforme une URL youtu.be courte en URL embed", () => {
    const result = getYoutubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(result).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("retourne null pour une URL non-YouTube", () => {
    expect(getYoutubeEmbedUrl("https://vimeo.com/123456")).toBeNull();
  });

  it("retourne null pour une chaîne invalide", () => {
    expect(getYoutubeEmbedUrl("pas-une-url")).toBeNull();
  });

  it("retourne null pour une URL YouTube sans video ID", () => {
    expect(getYoutubeEmbedUrl("https://www.youtube.com/channel/UCtest")).toBeNull();
  });

  it("retourne null pour une chaîne vide", () => {
    expect(getYoutubeEmbedUrl("")).toBeNull();
  });
});
