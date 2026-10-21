import { Context, Handler, SQSEvent, ScheduledEvent } from 'aws-lambda';
import { getHttpServer, getAppContext } from './lambda';
import { AppService } from './app.service';

// HTTP API
export const api: Handler = async (event, context, callback) => {
  if (!event.path) event.path = '/';
  const server = await getHttpServer();
  return server(event, context, callback);
};

// Direct invoke
export const sayHello = async (event: { name?: string }) => {
  const ctx = await getAppContext();
  const service = ctx.get(AppService);
  return { message: `Hello ${event.name ?? 'World'}`, data: service.getHello() };
};

// Scheduled job
export const cleanup = async (event: ScheduledEvent) => {
  const ctx = await getAppContext();
  console.log('Running cleanup at', event.time);
};

// SQS consumer
export const worker = async (event: SQSEvent, context: Context) => {
  const ctx = await getAppContext();
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    console.log('Processing', payload);
  }
};