import * as express from "express";
import * as cors from 'cors'
import "reflect-metadata";
import {Request, Response} from "express";
import {createConnection} from "typeorm";
import ormconfig from "../ormconfig";
import {User} from "./entity/User";
import * as dotenv from 'dotenv'

const PORT = 5050

dotenv.config()
//console.log(process.env)

// create typeorm connection
createConnection({
    type: "postgres",
    host: ormconfig.host,
    port: ormconfig.port,
    username: ormconfig.username,
    password: ormconfig.password,
    database: ormconfig.database,
    entities: [User],
    synchronize: true,
    logging: false,
}).then(async connection => {
    const userRepository = connection.getRepository(User);

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

    // register routes
    app.get("/", async function(req: Request, res: Response) {
        res.json({message: 'This is a test node'})
    })
    app.get("/users", async function(req: Request, res: Response) {
        const users = await userRepository.find();
        res.json(users);
    });

    app.get("/users/:id", async function(req: Request, res: Response) {
        const results = await userRepository.findOne(req.params.id);
        return res.send(results);
    });

    app.post("/users", async function(req: Request, res: Response) {
        const user = await userRepository.create(req.body);
        const results = await userRepository.save(user);
        return res.send(results);
    });

    app.put("/users/:id", async function(req: Request, res: Response) {
        const user = await userRepository.findOne(req.params.id);
        userRepository.merge(user, req.body);
        const results = await userRepository.save(user);
        return res.send(results);
    });

    app.delete("/users/:id", async function(req: Request, res: Response) {
        const results = await userRepository.delete(req.params.id);
        return res.send(results);
    });

    // start express server
    app.listen(PORT);
    console.log(`App is running on port ${PORT}...`)
});