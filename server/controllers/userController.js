import { addUserProfile, deleteUserProfile, getUserById, getUsers } from "../services/userService.js";

export async function listAllUsers(req, res) {
  const users = await getUsers();
  res.json(users);
}

export async function getOneUser(req, res) {
  const user = await getUserById(req.params.id);
  res.json(user);
}

export async function createUser(req, res) {
  const user = await addUserProfile(req.body);
  res.status(201).json(user);
}

export async function deleteUser(req, res) {
  const result = await deleteUserProfile(req.params.id);
  res.json(result);
}
