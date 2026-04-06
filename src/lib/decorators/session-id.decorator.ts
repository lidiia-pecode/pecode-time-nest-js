import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthContext } from 'src/auth/types/auth-context';

export const SessionId = createParamDecorator(
  (
    _: never,
    context: ExecutionContext,
  ): AuthContext['session_id'] | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: AuthContext }>();
    return request.user?.session_id;
  },
);
