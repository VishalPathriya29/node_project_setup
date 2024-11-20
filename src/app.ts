import { Express } from 'express';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import fs from 'fs';
import apiRouter from "./controller/index.route";
import { rateLimiterUsingThirdParty } from './middleware/rateLimiter';
import log from './helper/logger';
import { requestLogger } from './helper/utility';

export default (app: Express) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(cors());
    app.use(compression());
    app.use(helmet());

    app.use(requestLogger);
    // app.use(morgan('common', {
    //     stream: fs.createWriteStream(__dirname+ '/access.log', {flags: 'a'})
    // }));

    app.use('/api/v1', rateLimiterUsingThirdParty, apiRouter);
    app.use('*', (req, res) => {
        res.status(404).json({ message: 'Resource not available' });
    });
    // health check
    app.get('/', async (_req, res, _next) => {
        const healthcheck: any = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: new Date().toISOString(),
        };

        try {
            res.send(healthcheck);
        } catch (error) {
            healthcheck.message = error;
            res.status(503).send(healthcheck);
        }
    });
    app.get('/ping', async (_req, res, _next) => {
        const healthcheck: any = {
            message: 'OK',
        };

        try {
            res.send(healthcheck);
        } catch (error) {
            healthcheck.message = error;
            res.status(503).send(healthcheck);
        }
    });

    app.use((err: any, req: any, res: any, next: any) => {
        if (err) {
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: err
            });
        }
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({
            status: false,
            data: null,
            error: "Unexpected Error Occurred. Please contact our support team."
        });
    });
}
