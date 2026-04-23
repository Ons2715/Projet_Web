import { getUserById, getUsers } from "../services/userService.js";

export async function listAllUsers(req, res) {
  const users = await getUsers();
  res.json(users);
}

export async function getOneUser(req, res) {
  const user = await getUserById(req.params.id);
  res.json(user);
}
