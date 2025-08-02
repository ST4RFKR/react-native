import { CheckpointPhoto } from "./checkpointPhoto";

export interface Checkpoint {
  type: CheckpointType;
  userId?: string | null;
  vehicleId?: string | null;
  locationId: string;
  isVerified?: boolean;
  timestamp: string; 
  comment?: string | null;
  gpsCoords?: string | null;
  photos?: CheckpointPhoto[];

}
export type CheckpointType = 'ENTER' | 'EXIT' 
