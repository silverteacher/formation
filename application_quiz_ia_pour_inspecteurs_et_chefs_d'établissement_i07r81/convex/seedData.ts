import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedQuizData = mutation({
  args: {},
  handler: async (ctx) => {
    // Vérifier si des données existent déjà
    const existingQuizzes = await ctx.db.query("quizzes").collect();
    if (existingQuizzes.length > 0) {
      return "Les données existent déjà";
    }

    // Quiz pour Inspecteurs
    const inspectorQuizId = await ctx.db.insert("quizzes", {
      title: "IA et Inspection Pédagogique",
      description: "Évaluez vos connaissances sur l'utilisation de l'IA dans l'inspection pédagogique",
      category: "inspector",
      difficulty: "intermediaire",
      isActive: true,
    });

    // Questions pour inspecteurs
    const inspectorQuestions = [
      {
        question: "Quel est le principal avantage de l'IA dans l'analyse des pratiques pédagogiques ?",
        options: [
          "Remplacer complètement l'inspecteur",
          "Analyser de grandes quantités de données rapidement",
          "Éliminer le besoin d'observation en classe",
          "Automatiser les rapports d'inspection"
        ],
        correctAnswer: 1,
        explanation: "L'IA excelle dans l'analyse rapide de grandes quantités de données, permettant aux inspecteurs de détecter des tendances et patterns.",
        points: 10,
      },
      {
        question: "Dans le contexte de l'inspection, l'IA peut aider à :",
        options: [
          "Personnaliser les formations des enseignants",
          "Prédire les résultats des élèves",
          "Identifier les besoins d'accompagnement",
          "Toutes les réponses ci-dessus"
        ],
        correctAnswer: 3,
        explanation: "L'IA peut effectivement contribuer à tous ces aspects de l'inspection pédagogique.",
        points: 15,
      },
      {
        question: "Quelle précaution éthique est essentielle lors de l'utilisation d'IA en inspection ?",
        options: [
          "Utiliser uniquement des algorithmes propriétaires",
          "Garantir la transparence et l'explicabilité des décisions",
          "Automatiser toutes les évaluations",
          "Éviter toute intervention humaine"
        ],
        correctAnswer: 1,
        explanation: "La transparence et l'explicabilité sont cruciales pour maintenir la confiance et l'équité dans le processus d'inspection.",
        points: 20,
      },
    ];

    for (const q of inspectorQuestions) {
      await ctx.db.insert("questions", {
        quizId: inspectorQuizId,
        ...q,
      });
    }

    // Quiz pour Chefs d'Établissement
    const chefQuizId = await ctx.db.insert("quizzes", {
      title: "IA et Gestion d'Établissement",
      description: "Testez vos connaissances sur l'intégration de l'IA dans la gestion d'établissement scolaire",
      category: "chef_etablissement",
      difficulty: "intermediaire",
      isActive: true,
    });

    // Questions pour chefs d'établissement
    const chefQuestions = [
      {
        question: "Comment l'IA peut-elle améliorer la gestion des emplois du temps ?",
        options: [
          "En créant des emplois du temps parfaits automatiquement",
          "En optimisant les contraintes et ressources disponibles",
          "En éliminant le besoin de planification",
          "En remplaçant les logiciels existants"
        ],
        correctAnswer: 1,
        explanation: "L'IA peut optimiser la répartition des ressources en tenant compte de multiples contraintes simultanément.",
        points: 10,
      },
      {
        question: "Dans la gestion des ressources humaines, l'IA peut aider à :",
        options: [
          "Recruter automatiquement les enseignants",
          "Analyser les besoins en formation du personnel",
          "Remplacer les entretiens individuels",
          "Éliminer les conflits"
        ],
        correctAnswer: 1,
        explanation: "L'IA peut analyser les données de performance et identifier les besoins de formation personnalisés.",
        points: 15,
      },
      {
        question: "Quel est un risque majeur de l'IA dans la gestion d'établissement ?",
        options: [
          "La réduction des coûts",
          "L'amélioration de l'efficacité",
          "La déshumanisation des relations",
          "L'automatisation des tâches"
        ],
        correctAnswer: 2,
        explanation: "Le principal risque est de perdre l'aspect humain essentiel dans la gestion d'un établissement scolaire.",
        points: 20,
      },
    ];

    for (const q of chefQuestions) {
      await ctx.db.insert("questions", {
        quizId: chefQuizId,
        ...q,
      });
    }

    return "Données de test créées avec succès";
  },
});
