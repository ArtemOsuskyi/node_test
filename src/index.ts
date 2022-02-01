import * as express from "express";
import * as cors from 'cors'
import * as dotenv from 'dotenv'

import "reflect-metadata";
import {createConnection} from "typeorm";

import authRouter from "./routes/AuthRoutes";
import ormconfig from "../ormconfig";

import {User} from "./entity/User";
import {Token} from "./entity/Token";
import infoRouter from "./routes/InfoRoutes";

const PORT = 5050

//connecting .env file
dotenv.config()

// create typeorm connection
createConnection({
    type: "postgres",
    host: ormconfig.host,
    port: ormconfig.port,
    username: ormconfig.username,
    password: ormconfig.password,
    database: ormconfig.database,
    entities: [User, Token],
    synchronize: true,
    logging: false,
}).then(async () => {

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
    app.use('/', authRouter)
    app.use('/', infoRouter)

    //start express server
    app.listen(PORT);
    console.log(`App is running on port ${PORT}...`)
});