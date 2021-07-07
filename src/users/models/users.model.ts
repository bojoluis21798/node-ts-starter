import { getModelForClass, prop } from '@typegoose/typegoose';

class User {
  @prop()
  public email!: string;

  @prop()
  public password!: string;

  @prop()
  public firstname?: string;

  @prop()
  public lastname?: string;

  @prop()
  public permissionFlags!: number;
}

export default getModelForClass(User);
