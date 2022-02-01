import * as express from 'express'
import {login, signup, logout} from "../controllers/AuthController";

const authRouter = express.Router()

authRouter
    .post('/signin', login)
    .post('/signup', signup)
    .get('/logout', logout)

export default authRouter