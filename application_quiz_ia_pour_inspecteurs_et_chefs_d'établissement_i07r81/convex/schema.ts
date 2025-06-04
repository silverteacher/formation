import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  quizzes: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "inspector" ou "chef_etablissement"
    difficulty: v.string(), // "debutant", "intermediaire", "avance"
    isActive: v.boolean(),
  }).index("by_category_and_active", ["category", "isActive"]),
  
  questions: defineTable({
    quizId: v.id("quizzes"),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(), // index de la bonne réponse
    explanation: v.string(),
    points: v.number(),
  }).index("by_quiz", ["quizId"]),
  
  quizResults: defineTable({
    sessionId: v.string(), // identifiant de session au lieu d'userId
    userProfile: v.string(), // "inspector" ou "chef_etablissement"
    quizId: v.id("quizzes"),
    score: v.number(),
    totalPoints: v.number(),
    percentage: v.number(),
    answers: v.array(v.object({
      questionId: v.id("questions"),
      selectedAnswer: v.number(),
      isCorrect: v.boolean(),
      points: v.number(),
    })),
    completedAt: v.number(),
    timeSpent: v.number(), // en secondes
  }).index("by_session", ["sessionId"])
    .index("by_quiz", ["quizId"])
    .index("by_session_and_quiz", ["sessionId", "quizId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
