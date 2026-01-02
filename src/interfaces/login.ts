export interface LoginSuccessResponse {
  message: string;
  user: LoginUserInfo;
  token: string;
}

export interface LoginErrorResponse {
  message: string;
  statusMsg: string;
}

export interface LoginUserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
}
