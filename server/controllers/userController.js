import { addUserProfile, deleteUserProfile, getUserById, getUsers, updateMyFormation, updateMyPhoto } from "../services/userService.js";

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

export async function updateCurrentUserFormation(req, res) {
  const user = await updateMyFormation(req.user.id, req.body.formationId);
  res.json(user);
}

export async function updateCurrentUserPhoto(req, res) {
  const user = await updateMyPhoto(req.user.id, req.body.photo);
  res.json(user);
}
