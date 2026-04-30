import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // 🔥 detect GraphQL request
    const gqlContext = GqlExecutionContext.create(context);

    if (gqlContext.getType() === 'graphql') {
      return next.handle(); // ✅ DO NOT wrap
    }

    // REST responses
    return next.handle().pipe(
      map((res) => ({
        success: true,
        data: res.data ?? res,
        message: res.message || "Request Successful",
      })),
    );
  }
}