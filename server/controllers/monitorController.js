import { getMonitors } from "../services/monitorService.js";

export async function listAllMonitors(req, res) {
  const monitors = await getMonitors();
  res.json(monitors);
}
