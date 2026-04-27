import { getMonitorForStudent, getMonitors } from "../services/monitorService.js";

export async function listAllMonitors(req, res) {
  const monitors = await getMonitors();
  res.json(monitors);
}

export async function getCurrentStudentMonitor(req, res) {
  const monitor = await getMonitorForStudent(req.user.id);
  res.json(monitor);
}
