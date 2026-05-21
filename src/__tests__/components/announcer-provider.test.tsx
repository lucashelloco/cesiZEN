import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AnnouncerProvider, useAnnounce } from "@/components/announcer-provider";

function TestConsumer({ message }: { message: string }) {
  const announce = useAnnounce();
  return (
    <button onClick={() => announce(message)}>
      Annoncer
    </button>
  );
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("AnnouncerProvider", () => {
  it("rend la région aria-live dans le DOM", () => {
    render(
      <AnnouncerProvider>
        <div />
      </AnnouncerProvider>
    );
    expect(document.querySelector("[aria-live]")).toBeInTheDocument();
    expect(document.querySelector("[role='status']")).toBeInTheDocument();
  });

  it("affiche le message dans la région aria-live après 100ms", async () => {
    render(
      <AnnouncerProvider>
        <TestConsumer message="Contenu publié" />
      </AnnouncerProvider>
    );

    act(() => screen.getByRole("button").click());
    act(() => vi.advanceTimersByTime(100));

    expect(document.querySelector("[aria-live]")?.textContent).toBe("Contenu publié");
  });

  it("réinitialise puis réaffiche le même message pour forcer la relecture", async () => {
    render(
      <AnnouncerProvider>
        <TestConsumer message="Action effectuée" />
      </AnnouncerProvider>
    );

    const btn = screen.getByRole("button");

    // Premier appel
    act(() => btn.click());
    act(() => vi.advanceTimersByTime(100));
    expect(document.querySelector("[aria-live]")?.textContent).toBe("Action effectuée");

    // Deuxième appel identique — doit vider puis ré-afficher
    act(() => btn.click());
    expect(document.querySelector("[aria-live]")?.textContent).toBe("");
    act(() => vi.advanceTimersByTime(100));
    expect(document.querySelector("[aria-live]")?.textContent).toBe("Action effectuée");
  });

  it("fournit un no-op si utilisé hors du Provider", () => {
    function Orphan() {
      const announce = useAnnounce();
      // ne doit pas lever d'erreur
      announce("test");
      return null;
    }
    expect(() => render(<Orphan />)).not.toThrow();
  });
});
