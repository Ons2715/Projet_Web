import { getStudents } from "../services/studentService.js";

export async function listAllStudents(req, res) {
  const students = await getStudents();
  res.json(students);
}
