import winston from "winston";

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

const isDev = process.env.NODE_ENV !== "production";

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: isDev ? "debug" : "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: "api-service" },
  transports: [
    new winston.transports.Console({
      format: isDev
        ? combine(colorize(), timestamp(), consoleFormat)
        : combine(timestamp(), json()),
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
