import { UUID } from 'crypto';
import { User } from 'src/users/entities/user.entity';

export type AccessPayload = Pick<User, 'id' | 'email'> & { session_id: UUID };
