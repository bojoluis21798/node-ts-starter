import UsersDao from "../users.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";

class UserService implements CRUD {
  async list(limit: number, page: number) {
    return await UsersDao.getUsers();
  }

  async create(resource: CreateUserDto) {
    return await UsersDao.addUser(resource);
  }

  async putById(id: string, resource: PutUserDto) {
    return await UsersDao.patchUserById(id, resource);
  }

  async readById(id: string) {
    return await UsersDao.getUserById(id);
  }

  async deleteById(id: string) {
    return await UsersDao.removeUserById(id);
  }

  async patchById(id: string, resource: PatchUserDto) {
    return await UsersDao.patchUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return await UsersDao.getUserByEmail(email);
  }
}

export default new UserService();
