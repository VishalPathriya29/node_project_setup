import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, prettyPrint, printf } = format;

let log: any;

// const customFormat = printf(({ timestamp, level, message, ...meta }: { timestamp: string, level: string, message: string, [key: string]: any }) => {
const customFormat = printf(({ timestamp, level, message, ...meta }: any) => {
    return JSON.stringify({
        message: message,
        level: level,
        timestamp: timestamp,
        data: meta
    }, null, 2);
});


if (process.env.NODE_ENV === 'production') {
    log = createLogger({
        format: combine(
            timestamp(),
            json(),
            prettyPrint(),
            // customFormat
        ),
        transports: [
            new transports.File({ filename: 'error.log', level: 'error' }),
            new transports.File({ filename: 'info.log', level: 'info' }),
            new transports.Console()
        ]
    });
} else {
    log = createLogger({
        format: combine(
            timestamp(),
            json(),
            prettyPrint(),
            // customFormat
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'error.log', level: 'error' }),
            new transports.File({ filename: 'info.log', level: 'info' }),
        ]
    });
}

export default log;

