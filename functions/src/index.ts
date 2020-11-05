import express from 'express';
import cors from 'cors';

import { routesConfig } from './users/routes-config';

import initFirebaseApp from './config/app-env-config';

const app = express();

/*
All requests to HTTPS triggered Cloud Functions are automatically parsed by Cloud Functions
with an Express Body Parser before the request reaches your code in the function.
So even if you define your parser and middleware through Express,
it’s still already automatically parsed.
And you can’t explicitly define the parser that is used by Cloud Functions
*/
// app.use(express.json());

app.use(cors({ origin: true }));
routesConfig(app);

export const msAuthApi = initFirebaseApp(app);