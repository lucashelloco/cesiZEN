import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { Badge } from "@/components/ui/badge";

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v");
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export default async function ContenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contenu = await api.contenus.byId({ id });

  if (!contenu) notFound();

  const embedUrl = contenu.videoUrl ? getYoutubeEmbedUrl(contenu.videoUrl) : null;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/contenus"
        className="mb-6 inline-block text-sm font-medium hover:opacity-75"
        style={{ color: "var(--brand-green)" }}
      >
        ← Retour aux contenus
      </Link>

      <article className="rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-3">
          <Badge variant="outline">{contenu.type}</Badge>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {new Date(contenu.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500">· Par {contenu.auteur.name}</span>
        </div>

        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">{contenu.titre}</h1>

        <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {contenu.corps}
        </div>

        {embedUrl && (
          <div className="mt-8">
            <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={embedUrl}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={contenu.titre}
              />
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
