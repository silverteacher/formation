import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getQuizzesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_category_and_active", (q) => 
        q.eq("category", args.category).eq("isActive", true)
      )
      .collect();
  },
});

export const getQuizById = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.quizId);
  },
});

export const getQuizQuestions = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();
  },
});

export const submitQuizResult = mutation({
  args: {
    sessionId: v.string(),
    userProfile: v.string(),
    quizId: v.id("quizzes"),
    answers: v.array(v.object({
      questionId: v.id("questions"),
      selectedAnswer: v.number(),
    })),
    timeSpent: v.number(),
  },
  handler: async (ctx, args) => {
    // Récupérer les questions pour calculer le score
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();

    let score = 0;
    let totalPoints = 0;
    const detailedAnswers = [];

    for (const answer of args.answers) {
      const question = questions.find(q => q._id === answer.questionId);
      if (question) {
        totalPoints += question.points;
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        const points = isCorrect ? question.points : 0;
        score += points;
        
        detailedAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          points,
        });
      }
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    return await ctx.db.insert("quizResults", {
      sessionId: args.sessionId,
      userProfile: args.userProfile,
      quizId: args.quizId,
      score,
      totalPoints,
      percentage,
      answers: detailedAnswers,
      completedAt: Date.now(),
      timeSpent: args.timeSpent,
    });
  },
});

export const getSessionResults = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();

    // Enrichir avec les informations du quiz
    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const quiz = await ctx.db.get(result.quizId);
        return {
          ...result,
          quizTitle: quiz?.title || "Quiz supprimé",
          quizCategory: quiz?.category || "unknown",
        };
      })
    );

    return enrichedResults;
  },
});

export const getQuizStats = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();

    if (results.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        averagePercentage: 0,
        averageTime: 0,
      };
    }

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0);
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);

    return {
      totalAttempts: results.length,
      averageScore: Math.round(totalScore / results.length),
      averagePercentage: Math.round(totalPercentage / results.length),
      averageTime: Math.round(totalTime / results.length),
    };
  },
});
