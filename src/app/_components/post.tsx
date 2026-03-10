"use client";

/*
import { useState } from "react";
*/

/*
import { api } from "@/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div className="w-full max-w-md">
      <div className="card bg-white dark:bg-base-100 shadow-lg border-2 border-primary">
        <div className="card-body">
          {latestPost ? (
            <p className="card-title text-primary">Votre dernier post: {latestPost.name}</p>
          ) : (
            <p className="text-gray-600 dark:text-base-content/70">Vous n&apos;avez pas encore de posts.</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createPost.mutate({ name });
            }}
            className="flex flex-col gap-4 mt-4"
          >
            <input
              type="text"
              placeholder="Titre du post"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered input-lg w-full text-gray-900 dark:text-base-content"
            />
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={createPost.isPending}
            >
              {createPost.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Envoi...
                </>
              ) : (
                "Publier"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
*/

export function LatestPost() {
  return null;
}
