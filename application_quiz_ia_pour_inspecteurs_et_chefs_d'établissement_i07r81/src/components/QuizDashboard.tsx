import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { QuizCard } from "./QuizCard";
import { QuizTaker } from "./QuizTaker";
import { ResultsHistory } from "./ResultsHistory";
import { Id } from "../../convex/_generated/dataModel";

interface QuizDashboardProps {
  userProfile: "inspector" | "chef_etablissement";
  sessionId: string;
  onBackToSelection: () => void;
}

export function QuizDashboard({ userProfile, sessionId, onBackToSelection }: QuizDashboardProps) {
  const [activeTab, setActiveTab] = useState<"quizzes" | "results">("quizzes");
  const [selectedQuizId, setSelectedQuizId] = useState<Id<"quizzes"> | null>(null);
  
  const quizzes = useQuery(api.quizzes.getQuizzesByCategory, { category: userProfile });
  const seedData = useMutation(api.seedData.seedQuizData);

  const handleSeedData = useCallback(async () => {
    try {
      await seedData({});
    } catch (error) {
      console.error("Erreur lors de la création des données:", error);
    }
  }, [seedData]);

  const profileLabel = useMemo(() => {
    return userProfile === "inspector" ? "Inspecteur" : "Chef d'Établissement";
  }, [userProfile]);

  if (selectedQuizId) {
    return (
      <QuizTaker 
        quizId={selectedQuizId} 
        sessionId={sessionId}
        userProfile={userProfile}
        onBack={() => setSelectedQuizId(null)} 
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quiz {profileLabel}
        </h1>
        <p className="text-gray-600">
          Quiz spécialisés pour votre profil professionnel
        </p>
      </div>

      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "quizzes"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Quiz Disponibles
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "results"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Mes Résultats
          </button>
        </div>

        {/* Contenu */}
        {activeTab === "quizzes" && (
          <div>
            {quizzes === undefined ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500">Chargement des quiz...</p>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Aucun quiz disponible pour ce profil.</p>
                <button
                  onClick={handleSeedData}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Créer des quiz d'exemple
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz._id}
                    quiz={quiz}
                    onStart={() => setSelectedQuizId(quiz._id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "results" && <ResultsHistory sessionId={sessionId} />}
      </div>
    </div>
  );
}
