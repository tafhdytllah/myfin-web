export type UpdateProfilePayload = {
  username: string;
  email: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
