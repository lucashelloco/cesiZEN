export default function PolitiqueConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold" style={{ color: "var(--brand-green)" }}>
        Politique de confidentialité
      </h1>

      <div className="space-y-8 rounded-lg border bg-white p-8 text-sm text-gray-700 dark:border-gray-700 dark:bg-base-100 dark:text-gray-300">
        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Données collectées</h2>
          <p>Lors de la création de votre compte, nous collectons :</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>Votre nom ou pseudonyme</li>
            <li>Votre adresse email</li>
            <li>Votre mot de passe (stocké de façon chiffrée, jamais en clair)</li>
          </ul>
          <p className="mt-2">
            Nous collectons également les données liées à votre utilisation de l&apos;application : contenus consultés,
            configurations d&apos;exercices sauvegardées.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Finalité du traitement</h2>
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>La gestion de votre compte et de votre session</li>
            <li>La personnalisation de votre expérience (exercices sauvegardés)</li>
            <li>L&apos;amélioration du service (statistiques anonymes)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Base légale</h2>
          <p>
            Le traitement de vos données est fondé sur votre consentement lors de la création de votre compte,
            conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Durée de conservation</h2>
          <p>
            Vos données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression
            de votre compte à tout moment depuis votre page profil, ce qui entraîne la suppression immédiate
            et définitive de toutes vos données personnelles.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Vos droits (RGPD)</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li><strong>Droit d&apos;accès</strong> : consulter vos données depuis votre profil</li>
            <li><strong>Droit de rectification</strong> : modifier vos informations depuis votre profil</li>
            <li><strong>Droit à l&apos;effacement</strong> : supprimer votre compte depuis votre profil</li>
            <li><strong>Droit à la portabilité</strong> : demander une copie de vos données</li>
          </ul>
          <p className="mt-2">
            Pour exercer vos droits, contactez-nous directement ou utilisez les fonctionnalités disponibles dans votre espace profil.
          </p>
        </section>

        <section id="cookies">
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Politique relative aux cookies</h2>
          <p>CesiZen utilise uniquement des cookies strictement nécessaires au fonctionnement du service :</p>
          <div className="mt-3 overflow-x-auto rounded border dark:border-gray-600">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-base-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Cookie</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Finalité</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-3 py-2 font-mono">better-auth.session_token</td>
                  <td className="px-3 py-2">Maintien de la session utilisateur</td>
                  <td className="px-3 py-2">Session / 7 jours</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2 font-mono">cookie-consent</td>
                  <td className="px-3 py-2">Mémorisation de votre choix de consentement</td>
                  <td className="px-3 py-2">Indéfini (localStorage)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Aucun cookie publicitaire, analytique tiers ou de traçage n&apos;est déposé sur votre appareil.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">Partage des données</h2>
          <p>
            Vos données ne sont jamais vendues, louées ni transmises à des tiers à des fins commerciales.
          </p>
        </section>
      </div>
    </div>
  );
}
