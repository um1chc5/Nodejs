export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  date_of_birth: string
}

export interface LogoutRequestBody {
  refresh_token: string
}
