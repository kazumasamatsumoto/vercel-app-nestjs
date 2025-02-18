import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import serverless from 'serverless-http';
import { Application } from 'express';

let serverlessHandler: (event: any, context: any) => Promise<any>;

async function bootstrap(): Promise<
  (event: any, context: any) => Promise<any>
> {
  const app = await NestFactory.create(AppModule);
  await app.init();
  // ここで明示的に型キャストして、型安全にする
  const expressApp = app.getHttpAdapter().getInstance() as Application;
  return serverless(expressApp);
}

export const handler = async (event: any, context: any): Promise<any> => {
  if (!serverlessHandler) {
    serverlessHandler = await bootstrap();
  }
  return serverlessHandler(event, context);
};
