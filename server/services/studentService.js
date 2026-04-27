import { listStudents, listStudentsByMonitor } from "../repositories/studentRepository.js";

export async function getStudents() {
  return listStudents();
}

export async function getStudentsForMonitor(monitorId) {
  if (!monitorId) {
    const error = new Error("Moniteur introuvable.");
    error.status = 400;
    throw error;
  }

  return listStudentsByMonitor(monitorId);
}
