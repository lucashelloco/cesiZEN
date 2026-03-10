"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Contenu = {
  id: string;
  titre: string;
  corps: string;
  videoUrl?: string | null;
  type: "ARTICLE" | "DOCUMENT";
  isPublished: boolean;
};

export function ContenuForm({ contenu }: { contenu?: Contenu }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [titre, setTitre] = useState(contenu?.titre ?? "");
  const [corps, setCorps] = useState(contenu?.corps ?? "");
  const [videoUrl, setVideoUrl] = useState(contenu?.videoUrl ?? "");
  const [type, setType] = useState<"ARTICLE" | "DOCUMENT">(contenu?.type ?? "ARTICLE");
  const [isPublished, setIsPublished] = useState(contenu?.isPublished ?? false);

  const create = api.adminContenus.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      resetForm();
      router.refresh();
    },
  });

  const update = api.adminContenus.update.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  function resetForm() {
    setTitre("");
    setCorps("");
    setVideoUrl("");
    setType("ARTICLE");
    setIsPublished(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { titre, corps, videoUrl: videoUrl || undefined, type, isPublished };
    if (contenu) {
      update.mutate({ id: contenu.id, ...data });
    } else {
      create.mutate(data);
    }
  }

  const isPending = create.isPending || update.isPending;
  const error = create.error ?? update.error;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        {contenu ? "Modifier" : "Nouveau contenu"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{contenu ? "Modifier le contenu" : "Créer un contenu"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre</Label>
            <Input
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre du contenu"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "ARTICLE" | "DOCUMENT")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARTICLE">Article</SelectItem>
                  <SelectItem value="DOCUMENT">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={isPublished ? "published" : "draft"}
                onValueChange={(v) => setIsPublished(v === "published")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="corps">Contenu</Label>
            <Textarea
              id="corps"
              value={corps}
              onChange={(e) => setCorps(e.target.value)}
              placeholder="Rédigez votre contenu ici..."
              rows={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">
              Vidéo YouTube{" "}
              <span className="text-xs font-normal text-gray-400">(optionnel)</span>
            </Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              type="url"
            />
            <p className="text-xs text-gray-400">
              Formats acceptés : youtube.com/watch?v=… ou youtu.be/…
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error.message}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
