import { UUID } from 'crypto';
import { User } from 'src/users/entities/user.entity';

export interface AuthContext {
  user: User;
  session_id?: UUID;
}
