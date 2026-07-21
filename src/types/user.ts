export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}


export interface Credentials {
  password?: string;
  email?: string;
}