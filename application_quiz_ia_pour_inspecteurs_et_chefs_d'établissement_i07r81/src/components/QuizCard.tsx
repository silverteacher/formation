import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { memo, useMemo } from "react";

interface QuizCardProps {
  quiz: Doc<"quizzes">;
  onStart: () => void;
}

export const QuizCard = memo(function QuizCard({ quiz, onStart }: QuizCardProps) {
  const stats = useQuery(api.quizzes.getQuizStats, { quizId: quiz._id });

  const categoryLabel = useMemo(() => {
    switch (quiz.category) {
      case "inspector":
        return "Inspecteur";
      case "chef_etablissement":
        return "Chef d'Établissement";
      default:
        return quiz.category;
    }
  }, [quiz.category]);

  const difficultyColor = useMemo(() => {
    switch (quiz.difficulty) {
      case "debutant":
        return "bg-green-100 text-green-800";
      case "intermediaire":
        return "bg-yellow-100 text-yellow-800";
      case "avance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, [quiz.difficulty]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
          {quiz.difficulty}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{quiz.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {categoryLabel}
        </span>
      </div>

      {stats && stats.totalAttempts > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Statistiques</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Tentatives:</span>
              <span className="ml-1 font-medium">{stats.totalAttempts}</span>
            </div>
            <div>
              <span className="text-gray-500">Score moyen:</span>
              <span className="ml-1 font-medium">{stats.averagePercentage}%</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onStart}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Commencer le Quiz
      </button>
    </div>
  );
});
