import express from 'express';

import usersService from '../services/users.service';
import argon2 from 'argon2';
import debug from 'debug';
import { PatchUserDto } from '../dto/patch.user.dto';

const log: debug.IDebugger = debug('app:users-controller');

class UserController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.body.id);

    res.status(200).send(user);
  }

  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);

    const userId = await usersService.create(req.body);

    res.status(201).send({ id: userId, message: 'User added.' });
  }

  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    log(await usersService.patchById(req.body.id, req.body));
    res.status(200).send({ id: req.body.id, message: 'User patched.' });
  }

  async put(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    log(await usersService.putById(req.body.id, req.body));
    res.status(200).send({ id: req.body.id, message: 'User updated.' });
  }

  async removeUser(req: express.Request, res: express.Response) {
    log(await usersService.deleteById(req.body.id));
    res.status(200).send({ id: req.body.id, message: 'User removed.' });
  }

  async updatePermissionFlags(req: express.Request, res: express.Response) {
    const patchUserDto: PatchUserDto = {
      permissionFlags: parseInt(req.params.permissionFlags)
    };
    log(await usersService.patchById(req.body.id, patchUserDto));
    res.status(204).send();
  }
}

export default new UserController();
