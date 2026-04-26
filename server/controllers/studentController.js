import { getStudents } from "../services/studentService.js";

export async function listAllStudents(req, res) {
  const monitorId = Number.parseInt(req.query.monitorId, 10);
  const students = await getStudents(Number.isNaN(monitorId) ? undefined : monitorId);
  res.json(students);
}
