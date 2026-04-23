import { listStudents } from "../repositories/studentRepository.js";

export async function getStudents() {
  return listStudents();
}
