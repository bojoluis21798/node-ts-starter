import { CreateUserDto } from "./dto/create.user.dto";
import { PutUserDto } from "./dto/put.user.dto";
import { PatchUserDto } from "./dto/patch.user.dto";

import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  users: Array<CreateUserDto> = [];

  async addUser(user: CreateUserDto) {
    user.id = shortid();
    this.users.push(user);
    return user.id;
  }

  async getUsers() {
    return this.users;
  }

  async getUserById(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  async putUserById(userId: string, user: PutUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    this.users.splice(userIndex, 1, user);
    return `${user.id} updated via PUT`;
  }

  async patchUserById(userId: string, user: PatchUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    const currentUser = this.users[userIndex];

    const allowedPatchFields = [
      "firstname",
      "lastname",
      "password",
      "permissionLevel",
    ];

    const updatedUser = Object.entries(user).reduce(
      (obj, [key, value]) =>
        allowedPatchFields.includes(key) ? { ...obj, [key]: value } : obj,
      currentUser
    );

    this.users.splice(userIndex, 1, updatedUser);
    return `${user.id} patched`;
  }

  async removeUserById(userId: string) {
    const userIndex = this.users.findIndex((user) => user.id === userId);

    this.users.splice(userIndex, 1);

    return `${userId} removed`;
  }

  async getUserByEmail(email: string) {
    return this.users.find((user) => user.email === email) || null;
  }

  constructor() {
    log("Create new instance of UsersDao");
  }
}

export default new UsersDao();
