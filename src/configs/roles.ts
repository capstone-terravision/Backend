import { Role } from "../types/role";

export const roles: Role[] = [Role.USER, Role.ADMIN];

export const roleRights = new Map<Role, string[]>([
  [Role.USER, ["createPost"]],
  [Role.ADMIN, ["getUsers", "manageUsers", "createPost"]],
]);
