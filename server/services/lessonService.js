import { listLessons } from "../repositories/lessonRepository.js";

export async function getLessons() {
  return listLessons();
}
