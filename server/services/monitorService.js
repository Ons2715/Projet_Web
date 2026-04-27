import { findMonitorForStudent, listMonitors } from "../repositories/monitorRepository.js";

export async function getMonitors() {
  return listMonitors();
}

export async function getMonitorForStudent(studentId) {
  const monitor = await findMonitorForStudent(studentId);

  if (!monitor) {
    const error = new Error("Aucun moniteur n'est affecte a votre formation.");
    error.status = 404;
    throw error;
  }

  return monitor;
}
