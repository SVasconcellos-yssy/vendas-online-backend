import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { authorizationToLogionPayload } from 'src/utils/base-64-converter';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;

  const loginPayload = authorizationToLogionPayload(authorization);

  console.log(authorization);

  return loginPayload?.id;
});
