export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold" style={{ color: "var(--brand-green)" }}>
        Mentions légales
      </h1>

      <div className="space-y-8 rounded-lg border bg-white p-8 text-sm text-gray-700 dark:border-gray-700 dark:bg-base-100 dark:text-gray-300">
        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Éditeur du site</h2>
          <p>CesiZen est une application développée dans le cadre d&apos;un projet pédagogique CESI.</p>
          <p className="mt-1">École CESI — www.cesi.fr</p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Hébergement</h2>
          <p>Le site est hébergé sur un serveur local dans le cadre du projet.</p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Responsable de publication</h2>
          <p>L&apos;équipe pédagogique CESI.</p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, images, logo) sont protégés par le droit d&apos;auteur.
            Toute reproduction sans autorisation est interdite.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Responsabilité</h2>
          <p>
            Les informations fournies sur CesiZen ont un caractère informatif et ne se substituent pas à un avis médical professionnel.
            Pour tout problème de santé mentale, consultez un professionnel de santé.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Contact</h2>
          <p>Pour toute question relative au site, contactez l&apos;équipe pédagogique CESI.</p>
        </section>
      </div>
    </div>
  );
}
