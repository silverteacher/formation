import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface QuizResultsProps {
  resultId: Id<"quizResults">;
  sessionId: string;
  onBack: () => void;
}

export function QuizResults({ resultId, sessionId, onBack }: QuizResultsProps) {
  const results = useQuery(api.quizzes.getSessionResults, { sessionId });
  const currentResult = results?.find(r => r._id === resultId);

  if (!currentResult) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent ! Vous maîtrisez parfaitement le sujet.";
    if (percentage >= 80) return "Très bien ! Vous avez une bonne compréhension du sujet.";
    if (percentage >= 60) return "Bien ! Il y a quelques points à approfondir.";
    if (percentage >= 40) return "Passable. Une révision des concepts serait bénéfique.";
    return "Il est recommandé de revoir les concepts fondamentaux.";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          ← Retour au tableau de bord
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Résultats du Quiz</h1>
        <p className="text-gray-600">{currentResult.quizTitle}</p>
      </div>

      {/* Score principal */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
        <div className={`text-6xl font-bold mb-4 ${getScoreColor(currentResult.percentage)}`}>
          {currentResult.percentage}%
        </div>
        <div className="text-xl text-gray-700 mb-2">
          {currentResult.score} / {currentResult.totalPoints} points
        </div>
        <p className="text-gray-600 mb-4">
          {getScoreMessage(currentResult.percentage)}
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <div>
            <span className="font-medium">Temps:</span> {formatTime(currentResult.timeSpent)}
          </div>
          <div>
            <span className="font-medium">Date:</span> {new Date(currentResult.completedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {currentResult.answers.filter(a => a.isCorrect).length}
          </div>
          <div className="text-gray-600">Bonnes réponses</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {currentResult.answers.filter(a => !a.isCorrect).length}
          </div>
          <div className="text-gray-600">Mauvaises réponses</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {currentResult.answers.length}
          </div>
          <div className="text-gray-600">Total questions</div>
        </div>
      </div>

      {/* Barre de progression visuelle */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des réponses</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div className="h-full flex">
            <div
              className="bg-green-500"
              style={{ 
                width: `${(currentResult.answers.filter(a => a.isCorrect).length / currentResult.answers.length) * 100}%` 
              }}
            ></div>
            <div
              className="bg-red-500"
              style={{ 
                width: `${(currentResult.answers.filter(a => !a.isCorrect).length / currentResult.answers.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Correctes: {Math.round((currentResult.answers.filter(a => a.isCorrect).length / currentResult.answers.length) * 100)}%</span>
          <span>Incorrectes: {Math.round((currentResult.answers.filter(a => !a.isCorrect).length / currentResult.answers.length) * 100)}%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Que faire ensuite ?</h3>
        <div className="space-y-3">
          <button
            onClick={onBack}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Essayer d'autres quiz
          </button>
          {currentResult.percentage < 80 && (
            <p className="text-sm text-gray-600 mt-2">
              Conseil: Révisez les concepts et retentez le quiz pour améliorer votre score !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
