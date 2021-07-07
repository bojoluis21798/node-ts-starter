import { CommonRoutesConfig } from '../common/config.routes.config';
import authController from './controllers/auth.controller';
import authMiddleware from './middlewares/auth.middleware';
import express from 'express';
import bodyValidationMiddleware from '../common/middlewares/body.validation.middleware';
import jwtMiddleware from './middlewares/jwt.middleware';
import { body } from 'express-validator';

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'AuthRoutes');
  }

  configureRoutes(): express.Application {
    this.app.post('/auth', [
      body('email').isEmail(),
      body('password').isString(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      authController.createJWT
    ]);

    this.app.post('/auth/refresh-token', [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJWT
    ]);

    return this.app;
  }
}
