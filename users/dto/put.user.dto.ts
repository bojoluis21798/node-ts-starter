export interface PutUserDto {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  permissionFlags: number;
}
