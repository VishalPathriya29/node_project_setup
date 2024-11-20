import express from 'express';
import initRoutes from './app';
import initDb from './db';
import log from './helper/logger';

const port = process.env.PORT || 3000;
const app = express();

initRoutes(app);
initDb;

app.listen(port, () => {
    log.info(`Server is running on port ${port}`);
})

export default app;