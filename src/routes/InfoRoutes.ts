import * as express from 'express'
import {info} from "../controllers/InfoController";
import {verifyToken} from "../services/SecurityService";

const infoRouter = express.Router()

infoRouter.get('/', verifyToken, info)

export default infoRouter