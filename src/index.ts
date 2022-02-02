import * as express from "express";
import * as cors from 'cors'

import "reflect-metadata";
import {createConnection} from "typeorm";

import authRouter from "./routes/AuthRoutes";
import * as dbConfig from "../ormconfig";

import infoRouter from "./routes/InfoRoutes";
import latencyRouter from "./routes/LatencyRoutes";

const PORT = 5050

// create typeorm connection
createConnection(dbConfig.dbOptions).then(async () => {

    // create and setup express app
    const app = express();

    // setup CORS options
    const options: cors.CorsOptions = {
        allowedHeaders:[
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'X-Access-Token',
        ],
        credentials: true,
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
    };

    //initialize express app and CORS options
    app.use(express.json());
    app.use(cors(options));

    //API Routes
    app.use('/', authRouter)  // /signin, /signup and /logout routes
    app.use('/info', infoRouter)  // /info route
    app.use('/latency', latencyRouter)  //  /latency route

    //start express server
    app.listen(PORT);
    console.log(`App is running on port ${PORT}...`)
});