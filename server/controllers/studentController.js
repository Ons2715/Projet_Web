import { getStudents, getStudentsForMonitor } from "../services/studentService.js";

export async function listAllStudents(req, res) {
  const students = await getStudents();
  res.json(students);
}

export async function listMonitorStudents(req, res) {
  const students = await getStudentsForMonitor(req.params.monitorId);
  res.json(students);
}

export async function listCurrentMonitorStudents(req, res) {
  const students = await getStudentsForMonitor(req.user.id);
  res.json(students);
}
