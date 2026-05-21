import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-base-100">
      <hr />
      {/* Main footer */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Branding */}
          <div>
            <p className="text-xl font-bold">
              <span className="text-primary">CESI</span>
              <span className="text-accent">ZEN</span>
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-base-content/60">L&apos;application de votre santé mentale</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-gray-800 dark:text-base-content/80">Navigation</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="link link-hover text-gray-700 dark:text-base-content/70 hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/contenus" className="link link-hover text-gray-700 dark:text-base-content/70 hover:text-primary">
                  Contenus
                </Link>
              </li>
              <li>
                <Link href="/exercice" className="link link-hover text-gray-700 dark:text-base-content/70 hover:text-primary">
                  Exercice
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-gray-800 dark:text-base-content/80">Ressources</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="link link-hover text-gray-700 dark:text-base-content/70 hover:text-primary">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/register" className="link link-hover text-gray-700 dark:text-base-content/70 hover:text-primary">
                  Inscription
                </Link>
              </li>
              <li>
                <Link href="/profil" className="link link-hover text-gray-700 dark:text-base-content/70 hover:text-primary">
                  Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-gray-800 dark:text-base-content/80">Légal</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="link link-hover text-gray-700 dark:text-base-content/70 hover:text-primary">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="link link-hover text-gray-700 dark:text-base-content/70 hover:text-primary">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-base-300"></div>

      {/* Bottom footer */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600 dark:text-base-content/60">© {new Date().getFullYear()} CesiZen. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="#" className="link link-hover text-sm text-gray-600 dark:text-base-content/60 hover:text-primary">
              Twitter
            </Link>
            <Link href="#" className="link link-hover text-sm text-gray-600 dark:text-base-content/60 hover:text-primary">
              LinkedIn
            </Link>
            <Link href="#" className="link link-hover text-sm text-gray-600 dark:text-base-content/60 hover:text-primary">
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
