import Pino, { Logger } from 'pino';
import { LoggerOptions } from 'pino';

const targets: any = [
  {
    target: 'pino-pretty',
    level: 'info',
    options: {
      colorize: true,
      ignore:
        'pid,hostname,context,req,res,responseTime,trace_id,span_id,trace_flags',
      messageFormat:
        '{levelLabel} - {pid} - url:{req.url} - traceId:{trace_id} - spanId:{span_id} -- {msg}',
    },
  },
];

// Only send logs to opentelemetry if not in local environment
if (process.env.NODE_ENV != 'local') {
  targets[1] = {
    target: 'pino-opentelemetry-transport',
    level: 'info',
    options: {
      loggerName: 'api',
    },
  };
}
export const loggerOptions: LoggerOptions = {
  transport: {
    targets: targets,
  },
};

export const logger: Logger = Pino(loggerOptions);
