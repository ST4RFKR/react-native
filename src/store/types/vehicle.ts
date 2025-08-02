
export interface Vehicle {
  id: string
  plate: string
  model: string | null
  driverId: string | null
  createdAt: Date
}

export enum Role {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  MANAGER = "MANAGER",
  
}