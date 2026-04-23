import { listMonitors } from "../repositories/monitorRepository.js";

export async function getMonitors() {
  return listMonitors();
}
