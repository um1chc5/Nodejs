export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  date_of_birth: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordRequestBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}
