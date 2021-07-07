import express from 'express';
import { CommonRoutesConfig } from '../common/config.routes.config';
import usersController from './controllers/users.controller';
import usersMiddleware from './middlewares/users.middleware';

import bodyValidationMiddleware from '../common/middlewares/body.validation.middleware';
import { body } from 'express-validator';
import jwtMiddleware from '../auth/middlewares/jwt.middleware';
import permissionMiddleware from '../common/middlewares/common.permission.middleware';
import { PermissionFlag } from '../common/middlewares/common.permissionflag.middleware';

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes(): express.Application {
    this.app
      .route('/users')
      .get(
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION
        ),
        usersController.listUsers
      )
      .post(
        body('email').isEmail(),
        body('password')
          .isLength({ min: 5 })
          .withMessage('Must include password (+5 characters)'),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser
      );

    this.app.param('userId', usersMiddleware.extractUserId);

    this.app
      .route('/users/:userId')
      .all(
        usersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(usersController.getUserById)
      .delete(usersController.removeUser);

    this.app.put('/users/:userId', [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Must include password (+5 characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlags').isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validateSameEmailBelongToSameUser,
      permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      usersController.put
    ]);

    this.app.patch('/users/:userId', [
      body('email').isEmail().optional(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be 5+ characters')
        .optional(),
      body('firstName').isString().optional(),
      body('lastName').isString().optional(),
      body('permissionFlags').isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validatePatchEmail,
      permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      usersController.patch
    ]);

    this.app.put(
      `/users/:userId/permissionFlags/:permissionFlags`,
      jwtMiddleware.validJWTNeeded,
      permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      permissionMiddleware.permissionFlagRequired(
        PermissionFlag.FREE_PERMISSION
      ),
      usersController.updatePermissionFlags
    );

    return this.app;
  }
}
