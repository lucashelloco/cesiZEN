import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReadAloud } from "@/components/read-aloud";

const mockSpeak = vi.fn();
const mockCancel = vi.fn();

// Mock de SpeechSynthesisUtterance (absent de jsdom)
class MockUtterance {
  text: string;
  lang = "";
  rate = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) { this.text = text; }
}

Object.defineProperty(window, "SpeechSynthesisUtterance", {
  value: MockUtterance,
  writable: true,
});

Object.defineProperty(window, "speechSynthesis", {
  value: { speak: mockSpeak, cancel: mockCancel },
  writable: true,
});

beforeEach(() => vi.clearAllMocks());

describe("ReadAloud", () => {
  it("affiche le bouton Lire à voix haute quand speechSynthesis est supporté", () => {
    render(<ReadAloud text="Texte de test" />);
    expect(screen.getByRole("button", { name: /lire cet article/i })).toBeInTheDocument();
  });

  it("démarre la lecture et appelle speechSynthesis.speak au clic", () => {
    render(<ReadAloud text="Texte de test" />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSpeak).toHaveBeenCalledOnce();
    const utterance = mockSpeak.mock.calls[0]?.[0] as SpeechSynthesisUtterance;
    expect(utterance.text).toBe("Texte de test");
    expect(utterance.lang).toBe("fr-FR");
  });

  it("affiche Arrêter quand la lecture est en cours", () => {
    render(<ReadAloud text="Texte de test" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: /arrêter la lecture/i })).toBeInTheDocument();
  });

  it("a aria-pressed=true quand la lecture est active", () => {
    render(<ReadAloud text="Texte de test" />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("annule la lecture et revient à l'état initial au second clic", () => {
    render(<ReadAloud text="Texte de test" />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn); // démarrer
    fireEvent.click(btn); // arrêter
    expect(mockCancel).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /lire cet article/i })).toBeInTheDocument();
  });

  it("passe le texte complet à l'utterance", () => {
    const longText = "Titre de l'article. Corps du contenu avec plusieurs phrases.";
    render(<ReadAloud text={longText} />);
    fireEvent.click(screen.getByRole("button"));
    const utterance = mockSpeak.mock.calls[0]?.[0] as SpeechSynthesisUtterance;
    expect(utterance.text).toBe(longText);
  });
});
