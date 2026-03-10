import Link from "next/link";

const sections = [
  {
    title: "Front office",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/contenus", label: "Contenus santé" },
      { href: "/exercice", label: "Exercice de cohérence cardiaque" },
    ],
  },
  {
    title: "Mon compte",
    links: [
      { href: "/login", label: "Connexion" },
      { href: "/register", label: "Créer un compte" },
      { href: "/profil", label: "Mon profil" },
    ],
  },
  {
    title: "Informations légales",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
      { href: "/politique-de-confidentialite#cookies", label: "Gestion des cookies" },
    ],
  },
];

export default function PlanDuSitePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold" style={{ color: "var(--brand-green)" }}>
        Plan du site
      </h1>

      <div className="grid gap-6 sm:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-[#52a452]"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
