import * as path from "path";

require('dotenv').config()

export default {
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    migrationsRun: true,
    dropSchema: false,
    entities: ["/src/entity/*.ts"],
    migrations: [],
    cli: {
        entitiesDir: path.join(__dirname, "..", "entities"),
        migrationsDir: path.join(__dirname, "migrations")
    }
};