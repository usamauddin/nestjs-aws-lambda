import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { Handler } from 'aws-lambda';
import { INestApplication, INestApplicationContext } from '@nestjs/common';
import { AppModule } from './app.module';

let httpApp: INestApplication | undefined;
let httpServer: Handler | undefined;
let appContext: INestApplicationContext | undefined;

// Full Nest app with Express, for HTTP requests
export async function getHttpServer(): Promise<Handler> {
  if (!httpServer) {
    console.log('COLD START: HTTP');
    httpApp = await NestFactory.create(AppModule);
    await httpApp.init();
    httpServer = serverlessExpress({
      app: httpApp.getHttpAdapter().getInstance(),
    });
  }
  return httpServer;
}

// Lightweight Nest context (DI only), for non-HTTP handlers
export async function getAppContext(): Promise<INestApplicationContext> {
  if (!appContext) {
    console.log('COLD START: Context');
    appContext = await NestFactory.createApplicationContext(AppModule);
  }
  return appContext;
}