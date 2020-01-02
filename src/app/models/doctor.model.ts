import { User } from './user.model';
import { Patient } from './patient.model';
import { WaitingList } from './waitingList.model';
export interface Doctor {
  _id: string;
  user: User;
  waitingList: WaitingList[];
  availability: Boolean;
}
