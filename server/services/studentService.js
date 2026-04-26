import { listStudents } from "../repositories/studentRepository.js";

export async function getStudents(monitorId) {
  return listStudents(monitorId);
}
