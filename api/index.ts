import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import serverless from 'serverless-http';
import { Application, Request, Response } from 'express';

let serverlessHandler: ReturnType<typeof serverless> | null = null;

async function bootstrap(): Promise<ReturnType<typeof serverless>> {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance() as Application;
  return serverless(expressApp);
}

// default exportされた関数として定義する
export default async function handler(req: Request, res: Response) {
  if (!serverlessHandler) {
    serverlessHandler = await bootstrap();
  }
  return serverlessHandler(req, res);
}
