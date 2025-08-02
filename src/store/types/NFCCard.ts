export interface NFCCard {
  id: string
  cardId: string
  type: CardType
  userId: string | null
  vehicleId: string | null
  isActive: boolean
  issuedAt: Date
  deactivatedAt: Date | null
}
export enum CardType {
  EMPLOYEE = "EMPLOYEE",
  VEHICLE = "VEHICLE",
}