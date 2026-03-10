import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // ── Exercices présets ──────────────────────────────────────────────────────
  const presets = [
    { nom: "7-4-8", nombreCycles: 10, tempsInspiration: 7, tempsApnee: 4, tempsExpiration: 8, isPreset: true },
    { nom: "5-0-5", nombreCycles: 10, tempsInspiration: 5, tempsApnee: 0, tempsExpiration: 5, isPreset: true },
    { nom: "4-0-6", nombreCycles: 10, tempsInspiration: 4, tempsApnee: 0, tempsExpiration: 6, isPreset: true },
  ];

  for (const preset of presets) {
    await prisma.exerciceCardiaque.upsert({
      where: { nom_isPreset: { nom: preset.nom, isPreset: true } },
      update: preset,
      create: preset,
    });
  }

  // ── Admin auteur ───────────────────────────────────────────────────────────
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.log("Aucun admin trouvé — les contenus ne seront pas seedés.");
    return;
  }

  // ── Contenus santé ─────────────────────────────────────────────────────────
  const contenus = [
    {
      titre: "La cohérence cardiaque : comment ça marche ?",
      type: "ARTICLE" as const,
      videoUrl: "https://www.youtube.com/watch?v=vjA5Jjn7bWM",
      corps: `La cohérence cardiaque est une technique de respiration contrôlée qui permet de synchroniser le rythme cardiaque et le système nerveux autonome. En pratiquant 5 à 6 respirations par minute, vous activez le nerf vague et stimulez votre système parasympathique.

Pourquoi 6 respirations par minute ?
Cette fréquence correspond à la fréquence de résonance du système cardiovasculaire humain. À cette cadence, la variabilité de la fréquence cardiaque (HRV) est maximisée, ce qui signifie que votre cœur s'adapte de manière optimale à chaque inspiration et expiration.

Les bénéfices prouvés scientifiquement :
• Réduction du cortisol (hormone du stress) de 20 à 30 % après 3 mois de pratique régulière
• Amélioration de la mémoire de travail et de la concentration
• Stabilisation de la pression artérielle
• Meilleure régulation émotionnelle
• Amélioration de la qualité du sommeil

La règle des 365 :
Les chercheurs recommandent de pratiquer 3 fois par jour, 6 respirations par minute, pendant 5 minutes. Cette pratique quotidienne permet de maintenir des niveaux de sérotonine et de DHEA élevés tout au long de la journée.`,
      isPublished: true,
    },
    {
      titre: "5 techniques pour gérer le stress au quotidien",
      type: "ARTICLE" as const,
      videoUrl: null,
      corps: `Le stress chronique est l'un des principaux facteurs de risque pour la santé mentale et physique. Voici 5 techniques validées scientifiquement pour le réduire efficacement.

1. La respiration diaphragmatique
Inspirez lentement par le nez en gonflant le ventre (4 secondes), retenez (2 secondes), puis expirez lentement par la bouche (6 secondes). Répétez 5 fois. Cette technique active immédiatement le système nerveux parasympathique.

2. La cohérence cardiaque
6 respirations par minute pendant 5 minutes, 3 fois par jour. Les effets sur le cortisol sont mesurables dès la première semaine de pratique.

3. La pleine conscience (mindfulness)
Consacrez 10 minutes par jour à observer vos pensées sans jugement. Des études montrent qu'une pratique régulière réduit l'amygdale cérébrale, zone responsable des réactions de peur et de stress.

4. L'activité physique régulière
30 minutes de marche rapide par jour libèrent des endorphines et réduisent les hormones de stress. L'exercice est aussi efficace que certains antidépresseurs pour les états anxieux légers.

5. La déconnexion numérique
Établissez des plages horaires sans écran, notamment 1 heure avant le coucher. La lumière bleue des écrans perturbe la mélatonine et augmente l'état d'alerte du cerveau.`,
      isPublished: true,
    },
    {
      titre: "Comprendre l'anxiété : mécanismes et solutions",
      type: "ARTICLE" as const,
      videoUrl: null,
      corps: `L'anxiété est une réponse naturelle du cerveau face à une menace perçue. Elle devient problématique lorsqu'elle est disproportionnée ou persistante.

Que se passe-t-il dans le cerveau ?
L'amygdale, notre système d'alarme cérébral, détecte une menace et déclenche la libération d'adrénaline et de cortisol. Le corps se prépare à "combattre ou fuir" : accélération cardiaque, tensions musculaires, hyperventilation.

Les types d'anxiété
• Anxiété situationnelle : liée à un événement précis (examen, entretien)
• Anxiété généralisée : inquiétudes persistantes concernant de nombreux domaines
• Trouble panique : crises d'angoisse intenses et soudaines
• Phobie : peur intense et irrationnelle d'un objet ou d'une situation

Quand consulter un professionnel ?
Si l'anxiété interfère avec votre vie quotidienne depuis plus de 2 semaines, il est recommandé de consulter un médecin ou un psychologue. N'attendez pas que les symptômes s'aggravent.

Approches thérapeutiques efficaces
La thérapie cognitivo-comportementale (TCC) est considérée comme le traitement de référence pour les troubles anxieux. Elle permet d'identifier et de modifier les schémas de pensée négatifs. L'EMDR et la thérapie d'acceptation et d'engagement (ACT) montrent également de très bons résultats.`,
      isPublished: true,
    },
    {
      titre: "Le sommeil et la santé mentale : un lien indissociable",
      type: "ARTICLE" as const,
      videoUrl: "https://www.youtube.com/watch?v=nm1TxQj9IsQ",
      corps: `Dormir n'est pas un luxe, c'est une nécessité biologique. Un sommeil de mauvaise qualité est à la fois une cause et une conséquence des troubles de santé mentale.

Pourquoi le sommeil est essentiel au cerveau ?
Pendant le sommeil profond, le cerveau se "nettoie" via le système glymphatique : il élimine les déchets métaboliques, notamment la protéine bêta-amyloïde associée à la maladie d'Alzheimer. Le sommeil paradoxal (REM) consolide la mémoire émotionnelle et aide à traiter les expériences difficiles.

Les conséquences du manque de sommeil
• Augmentation de 40 % de l'activité de l'amygdale (réactions émotionnelles excessives)
• Diminution du cortex préfrontal, responsable de la prise de décision rationnelle
• Risque multiplié par 3 de développer une dépression
• Affaiblissement du système immunitaire

Conseils pour améliorer son sommeil
1. Respectez des horaires réguliers, même le week-end
2. Évitez les écrans 1 heure avant de dormir
3. Maintenez une chambre fraîche (18-19°C)
4. Pratiquez une relaxation ou de la cohérence cardiaque avant le coucher
5. Évitez la caféine après 14h`,
      isPublished: true,
    },
    {
      titre: "Fiche pratique : la technique de respiration 4-7-8",
      type: "DOCUMENT" as const,
      videoUrl: null,
      corps: `TECHNIQUE DE RESPIRATION 4-7-8
Développée par le Dr Andrew Weil, médecin à l'Université d'Arizona

━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESCRIPTION
La respiration 4-7-8 est une technique de relaxation rapide basée sur le contrôle du souffle. Elle agit comme un tranquillisant naturel pour le système nerveux.

━━━━━━━━━━━━━━━━━━━━━━━━━━━

MODE D'EMPLOI

1. Videz complètement vos poumons par la bouche
2. Fermez la bouche et inspirez silencieusement par le nez pendant 4 secondes
3. Retenez votre respiration pendant 7 secondes
4. Expirez complètement par la bouche pendant 8 secondes (vous pouvez faire un son "woosh")
5. Répétez le cycle 3 à 4 fois

━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUAND L'UTILISER
• Avant de dormir pour faciliter l'endormissement
• Lors d'une montée de stress ou d'anxiété
• Avant une situation stressante (prise de parole, examen)
• En cas de colère pour retrouver son calme

━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRÉCAUTIONS
Ne pas pratiquer en conduisant. Au début, vous pouvez ressentir un léger vertige — c'est normal. Limitez à 4 cycles lors des premières semaines.

━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRÉQUENCE RECOMMANDÉE
2 fois par jour pendant 6 à 8 semaines pour des effets durables.`,
      isPublished: true,
    },
    {
      titre: "Guide : Initiation à la méditation de pleine conscience",
      type: "DOCUMENT" as const,
      videoUrl: "https://www.youtube.com/watch?v=inpok4MKVLM",
      corps: `GUIDE DE MÉDITATION DE PLEINE CONSCIENCE
Pour débutants et pratiquants intermédiaires

━━━━━━━━━━━━━━━━━━━━━━━━━━━

QU'EST-CE QUE LA PLEINE CONSCIENCE ?
La pleine conscience (mindfulness) est la capacité à porter son attention sur le moment présent, sans jugement. Elle est issue des traditions bouddhistes et a été adaptée en thérapie par Jon Kabat-Zinn dans les années 1970.

━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROGRAMME DÉBUTANT (4 semaines)

Semaine 1 — 5 minutes par jour
Asseyez-vous confortablement. Fermez les yeux. Concentrez-vous uniquement sur votre respiration. Quand votre esprit s'égare, ramenez doucement l'attention sur le souffle.

Semaine 2 — 10 minutes par jour
Étendez la pratique à votre corps entier : scan corporel de la tête aux pieds. Observez les sensations sans les juger.

Semaine 3 — 15 minutes par jour
Intégrez la méditation en mouvement : marchez lentement en étant pleinement conscient de chaque pas.

Semaine 4 — 20 minutes par jour
Méditation sur les émotions : accueillez chaque émotion comme un nuage qui passe, sans vous y accrocher.

━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONSEILS PRATIQUES
• Méditez à la même heure chaque jour pour créer une habitude
• Utilisez un timer pour ne pas regarder l'heure
• Un coussin ou une chaise suffit — pas besoin de position particulière
• Si vous vous endormez, c'est que vous avez besoin de sommeil

━━━━━━━━━━━━━━━━━━━━━━━━━━━

EFFETS APRÈS 8 SEMAINES DE PRATIQUE RÉGULIÈRE
• Réduction de 43 % des symptômes d'anxiété (Harvard Medical School)
• Épaississement du cortex préfrontal (meilleure régulation émotionnelle)
• Diminution de la rumination mentale`,
      isPublished: true,
    },
    {
      titre: "Protocole de gestion du stress au travail",
      type: "DOCUMENT" as const,
      videoUrl: null,
      corps: `PROTOCOLE DE GESTION DU STRESS AU TRAVAIL
À destination des étudiants et professionnels

━━━━━━━━━━━━━━━━━━━━━━━━━━━

IDENTIFIER LES SOURCES DE STRESS

Facteurs organisationnels
□ Charge de travail excessive
□ Délais irréalistes
□ Manque de clarté des objectifs
□ Faible autonomie dans les tâches
□ Conflits avec collègues ou supérieurs

Facteurs personnels
□ Perfectionnisme excessif
□ Difficulté à déléguer
□ Manque de limites (difficulté à dire non)
□ Mauvaise gestion du temps

━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROTOCOLE D'URGENCE (stress aigu)

Étape 1 — Pause physique (2 min)
Quittez la situation si possible. Buvez un verre d'eau fraîche.

Étape 2 — Respiration cohérence cardiaque (5 min)
6 respirations par minute : 5 sec inspiration / 5 sec expiration.

Étape 3 — Recadrage cognitif (3 min)
Demandez-vous : "Dans 5 ans, est-ce que cela aura encore de l'importance ?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━

HYGIÈNE DE VIE ANTI-STRESS

Quotidien
• Cohérence cardiaque 3x/jour (matin, midi, soir)
• 30 min d'activité physique minimum
• 7 à 9 heures de sommeil
• Repas équilibrés sans saut de repas

Hebdomadaire
• 1 activité de loisir plaisante
• Temps de socialisation (amis, famille)
• Bilan de la semaine : ce qui a bien fonctionné vs difficultés

━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUAND DEMANDER DE L'AIDE
Si les symptômes persistent plus de 2 semaines ou impactent votre vie quotidienne, consultez un médecin ou un psychologue.`,
      isPublished: true,
    },
    {
      titre: "La bienveillance envers soi-même : sortir de l'auto-critique",
      type: "ARTICLE" as const,
      videoUrl: null,
      corps: `L'auto-critique excessive est l'un des principaux obstacles au bien-être psychologique. Nous sommes souvent bien plus sévères envers nous-mêmes que nous ne le serions envers un ami.

Pourquoi sommes-nous si durs avec nous-mêmes ?
Notre cerveau est câblé pour détecter les erreurs et les menaces — c'est un mécanisme de survie hérité de l'évolution. Mais appliqué à soi-même, ce système d'auto-évaluation permanente peut devenir destructeur. La psychologue Kristin Neff a montré que l'auto-compassion n'est pas de la faiblesse, mais un puissant facteur de résilience.

Les 3 composantes de l'auto-compassion (Kristin Neff)
1. La bienveillance envers soi : se traiter avec la même gentillesse qu'on offrirait à un ami
2. L'humanité commune : reconnaître que la souffrance et les erreurs font partie de l'expérience humaine
3. La pleine conscience : observer ses pensées et émotions douloureuses sans s'y identifier

Exercice pratique : la lettre à un ami
Pensez à une situation qui vous préoccupe ou dans laquelle vous vous êtes senti en échec. Maintenant, écrivez une lettre comme si vous l'adressiez à un ami cher qui vivrait la même situation. Que lui diriez-vous ? Réalisez ensuite que vous méritez les mêmes mots.

L'auto-compassion n'est pas de l'indulgence
Contrairement aux idées reçues, l'auto-compassion ne conduit pas à la complaisance ou à la perte de motivation. Les études montrent qu'elle augmente la responsabilité personnelle, car on a moins peur d'affronter ses erreurs quand on sait qu'on peut se traiter avec bienveillance.`,
      isPublished: true,
    },
  ];

  for (const contenu of contenus) {
    await prisma.contenu.upsert({
      where: {
        // On utilise un identifiant composite sur le titre pour éviter les doublons
        // Prisma ne supporte pas upsert sur un champ non-unique, on cherche donc d'abord
        id: (await prisma.contenu.findFirst({ where: { titre: contenu.titre } }))?.id ?? "new",
      },
      update: { ...contenu, auteurId: admin.id },
      create: { ...contenu, auteurId: admin.id },
    });
  }

  console.log(`✓ ${presets.length} exercices présets seedés`);
  console.log(`✓ ${contenus.length} contenus seedés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
