import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Marque */}
          <div>
            <p className="text-sm font-extrabold tracking-tight">
              <span style={{ color: "var(--brand-green)" }}>CESI</span>
              <span style={{ color: "var(--brand-yellow)" }}>ZEN</span>
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">L&apos;application de votre santé mentale</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Navigation</p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white">Accueil</Link></li>
              <li><Link href="/contenus" className="hover:text-gray-900 dark:hover:text-white">Contenus</Link></li>
              <li><Link href="/exercice" className="hover:text-gray-900 dark:hover:text-white">Exercice</Link></li>
              <li><Link href="/plan-du-site" className="hover:text-gray-900 dark:hover:text-white">Plan du site</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Informations légales</p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/mentions-legales" className="hover:text-gray-900 dark:hover:text-white">Mentions légales</Link></li>
              <li><Link href="/politique-de-confidentialite" className="hover:text-gray-900 dark:hover:text-white">Politique de confidentialité</Link></li>
              <li><Link href="/politique-de-confidentialite#cookies" className="hover:text-gray-900 dark:hover:text-white">Gestion des cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
          © {new Date().getFullYear()} CesiZen — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
