import { db } from "@/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const [totalUsers, totalContenus, publishedContenus, totalExercices] =
    await Promise.all([
      db.user.count(),
      db.contenu.count(),
      db.contenu.count({ where: { isPublished: true } }),
      db.exerciceCardiaque.count({ where: { isPreset: true } }),
    ]);

  const stats = [
    { label: "Utilisateurs", value: totalUsers },
    { label: "Contenus total", value: totalContenus },
    { label: "Contenus publiés", value: publishedContenus },
    { label: "Exercices presets", value: totalExercices },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold" style={{ color: "var(--brand-green)" }}>Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
