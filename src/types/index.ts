export type UserRole =
  | "contributor"
  | "maintainer";

export interface IJwtPayload {
  id: number;
  name: string;
  role: UserRole;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  role:UserRole;
  created_at: Date;
  updated_at: Date;
}