import { getModelForClass, prop } from "@typegoose/typegoose";

class User {
  @prop()
  public _id!: string;

  @prop()
  public email!: string;

  @prop()
  public password!: string;

  @prop()
  public firstname?: string | undefined;

  @prop()
  public lastname?: string | undefined;

  @prop()
  public permissionFlags!: number;
}

export default getModelForClass(User);
