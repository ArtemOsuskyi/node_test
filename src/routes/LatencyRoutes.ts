import * as express from 'express'
import {latency} from "../controllers/LatencyController";

const latencyRouter = express.Router()

latencyRouter.get('/', latency)

export default latencyRouter