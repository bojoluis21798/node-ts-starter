import { CreateUserDto } from "./dto/create.user.dto";
import { PutUserDto } from "./dto/put.user.dto";
import { PatchUserDto } from "./dto/patch.user.dto";

import shortid from "shortid";
import debug from "debug";
import UserModel from "./models/users.model";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();

    await UserModel.create({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });

    return userId;
  }

  async getUserByEmail(email: string) {
    return UserModel.findOne({ email: email }).exec();
  }

  async getUserById(userId: string) {
    return UserModel.findOne({ _id: userId }).populate("User").exec();
  }

  async getUsers(limit = 25, page = 0) {
    return UserModel.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async getUserByEmailWithPassword(email: string) {
    return UserModel.findOne({ email: email })
      .select("_id email permissionFlags +password")
      .exec();
  }

  async removeUserById(userId: string) {
    return UserModel.deleteOne({ _id: userId }).exec();
  }

  constructor() {
    log("Create new instance of UsersDao");
  }
}

export default new UsersDao();
