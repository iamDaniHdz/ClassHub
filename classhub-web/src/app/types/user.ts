export interface Role {
  key: string;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role | null;
}