export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  active: boolean;
};

export type UserResponse = User;

export type UpdateUserRequest = {
  username: string;
  email: string;
};

export type ChangePasswordUserRequest = {
  currentPassword: string;
  newPassword: string;
};
