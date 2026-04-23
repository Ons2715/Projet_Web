import { getLessons } from "../src/services/lessonService.js";

export async function listAllLessons(req, res) {
  const lessons = await getLessons();
  res.json(lessons);
}
