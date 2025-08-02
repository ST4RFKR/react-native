
export interface User {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: Role
}
export enum Role {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  MANAGER = "MANAGER",
  
}