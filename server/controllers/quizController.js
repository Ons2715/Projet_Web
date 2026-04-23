import { getQuiz } from "../services/quizService.js";

export async function listAllQuiz(req, res) {
  const quiz = await getQuiz();
  res.json(quiz);
}
