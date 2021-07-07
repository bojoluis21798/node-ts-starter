import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/create.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import UserModel from '../models/users.model';
import shortid from 'shortid';

class UserService implements CRUD {
  async list(limit = 25, page = 0) {
    return UserModel.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async create(userFields: CreateUserDto) {
    const userId = shortid.generate();

    await UserModel.create({
      _id: userId,
      ...userFields,
      permissionFlags: 1
    });

    return userId;
  }

  async putById(userId: string, userFields: PutUserDto) {
    const existingUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async readById(userId: string) {
    return await UserModel.findOne({ _id: userId }).populate('User').exec();
  }

  async deleteById(userId: string) {
    return await UserModel.deleteOne({ _id: userId }).exec();
  }

  async patchById(userId: string, userFields: PatchUserDto) {
    const existingUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async getUserByEmail(email: string) {
    return await UserModel.findOne({ email: email }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return await UserModel.findOne({ email: email })
      .select('_id email permissionFlags +password')
      .exec();
  }

  async removeUserById(userId: string) {
    return await UserModel.deleteOne({ _id: userId }).exec();
  }
}

export default new UserService();
