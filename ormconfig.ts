import * as path from "path";
import {ConnectionOptions} from "typeorm";
import {User} from "./src/entity/User";
import {Token} from "./src/entity/Token";

require('dotenv').config()

export const dbOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    migrationsRun: true,
    dropSchema: false,
    entities: [User, Token],
    migrations: [],
    cli: {
        entitiesDir: path.join(__dirname, "..", "entities"),
        migrationsDir: path.join(__dirname, "migrations")
    }
};