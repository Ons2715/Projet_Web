import { listQuiz } from "../repositories/quizRepository.js";

export async function getQuiz() {
  return listQuiz();
}
