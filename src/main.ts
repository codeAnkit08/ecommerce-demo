import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // main.ts
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const formattedErrors: Record<string, string> = {};

        errors.forEach((err) => {
          if (err.constraints) {
            formattedErrors[err.property] =
              Object.values(err.constraints)[0];
          }
        });

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }
    }),
  );
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
