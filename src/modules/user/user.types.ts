

export interface signupUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm_password?: string;
  contact_number: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}