import express from "express";
import { CommonRoutesConfig } from "../common/config.routes.config";

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }

  configureRoutes() {
    this.app
      .route("/users")
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send("All users");
      });

    this.app
      .route("/users/:userId")
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`User : ${req.params.userId}`);
      });

    return this.app;
  }
}
