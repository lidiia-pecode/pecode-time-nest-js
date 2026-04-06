import { UUID } from 'crypto';

export type RefreshPayload = { session_id: UUID; user_id: number };
