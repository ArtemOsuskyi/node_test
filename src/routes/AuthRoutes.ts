import * as express from 'express'
import {signup, login, logout} from "../controllers/AuthController";

const authRouter = express.Router()

authRouter
    .post('/signin', login)
    .post('/signup', signup)
    .get('/logout', logout)

export default authRouter