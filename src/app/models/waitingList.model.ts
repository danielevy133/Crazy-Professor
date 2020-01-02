import { User } from './user.model';
export interface WaitingList {
  patient: User;
  dateCome: Date;
  getMassage:Boolean
}
