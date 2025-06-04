import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { QuizResults } from "./QuizResults";

interface QuizTakerProps {
  quizId: Id<"quizzes">;
  sessionId: string;
  userProfile: string;
  onBack: () => void;
}

export function QuizTaker({ quizId, sessionId, userProfile, onBack }: QuizTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime] = useState(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultId, setResultId] = useState<Id<"quizResults"> | null>(null);

  const quiz = useQuery(api.quizzes.getQuizById, { quizId });
  const questions = useQuery(api.quizzes.getQuizQuestions, { quizId });
  const submitQuiz = useMutation(api.quizzes.submitQuizResult);

  const currentQuestion = useMemo(() => 
    questions?.[currentQuestionIndex], 
    [questions, currentQuestionIndex]
  );
  
  const isLastQuestion = useMemo(() => 
    currentQuestionIndex === (questions?.length || 0) - 1, 
    [currentQuestionIndex, questions?.length]
  );
  
  const allQuestionsAnswered = useMemo(() => 
    questions?.every(q => answers[q._id] !== undefined), 
    [questions, answers]
  );

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion._id]: answerIndex
    }));
  }, [currentQuestion]);

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!questions || !allQuestionsAnswered) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const formattedAnswers = questions.map(q => ({
      questionId: q._id,
      selectedAnswer: answers[q._id],
    }));

    try {
      const result = await submitQuiz({
        sessionId,
        userProfile,
        quizId,
        answers: formattedAnswers,
        timeSpent,
      });
      setResultId(result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  if (isSubmitted && resultId) {
    return <QuizResults resultId={resultId} sessionId={sessionId} onBack={onBack} />;
  }

  if (!quiz || !questions) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Retour aux quiz
          </button>
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question actuelle */}
      {currentQuestion && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  answers[currentQuestion._id] === index
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium text-gray-700">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="ml-2">{option}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>

          <div className="flex space-x-3">
            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion?._id || ""] === undefined}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Terminer le Quiz
              </button>
            )}
          </div>
        </div>

        {/* Indicateur de progression */}
        <div className="mt-4 flex justify-center space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestionIndex
                  ? "bg-blue-600"
                  : answers[questions[index]._id] !== undefined
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
