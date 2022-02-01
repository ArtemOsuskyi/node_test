import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {decode,verify} from "jsonwebtoken";
import {createToken} from '../services/SecurityService'

import * as bcrypt from 'bcrypt'

import {Token} from "../entity/Token";
import {User} from "../entity/User";

const emailPattern: RegExp = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
const phonePattern: RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/


const signup = async (req:Request, res:Response) => {  //registration
    try{
        const userRepository = getRepository(User)
        const tokenRepository = getRepository(Token)

        const {username, password} = req.body
        const email: Boolean = emailPattern.test(username)
        const phoneNumber: Boolean = phonePattern.test(username)
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User();
        user.username = username

        const takenEmailOrNumber = await userRepository.findOne(user, {select: username})
        if(takenEmailOrNumber) return res.status(400).json({message: "This ID is already taken"})
        user.password = hashedPassword

        if (email) user.id_type = "email"
        else if (phoneNumber) user.id_type = "phone number"
        else return res.status(400).json({message: "Incorrect ID format"})

        const token = new Token()
        token.token = createToken(user)
        const tokenPayload = decode(token.token)

        token.expire_date = new Date(tokenPayload['exp'] * 1000)
        token.owner = user

        await tokenRepository.save(token)
        await userRepository.save(user)

        res.header('Token', token.token)
        return res.status(200).json({message: "Signup successful"})

    } catch (e){
        return res.status(500).send(e)
    }
}

const login = async (req: Request, res: Response) => {  //login
    const userRepository = getRepository(User)
    const tokenRepository = getRepository(Token)

    const {username, password} = req.body
    const userModel = new User()
    userModel.username = username

    const user = await userRepository.findOne(userModel)
    if(!user) throw new loginOrPasswordInvalid("Username or password are invalid")

    const dbPassword = user.password
    const passMatch = bcrypt.compareSync(password, dbPassword)
    if(!passMatch) throw new loginOrPasswordInvalid("Username or password are invalid")

    const accessToken = new Token()
    accessToken.token = createToken(user)
    const tokenPayload = decode(accessToken.token)

    accessToken.expire_date = new Date(tokenPayload['exp'] * 1000)
    accessToken.owner = user

    await tokenRepository.save(accessToken)
    await userRepository.update(userModel, user)

    res.header('Token', accessToken.token)
    return res.status(200).json({message: "Login successful"})
}

const logout = async (req: Request, res: Response) => {
    try{
        const tokenRepository = getRepository(Token)

        const header = req.headers['authorization']
        const headerToken = header.split(' ')[1]

        const newToken = new Token()
        newToken.token = headerToken

        const removeToken = await tokenRepository.findOne(newToken)
        if (!removeToken) return res.status(400).json({message: "Token doesn't exist"})

        if(req.query.all === "false") {
            verify(headerToken, process.env.ACCESS_TOKEN_SECRET, async (err) => {
                if (err) {
                    //await tokenRepository.delete(headerToken)
                    return res.status(403).json({message: "Token is already expired"})
                }
            })
            await tokenRepository.remove(removeToken)
            res.json({message: "Logout successful"})

        } else if (req.query.all === "true"){
            const allTokens = await tokenRepository.find()
            await tokenRepository.remove(allTokens)
            res.json({message: "Logout successful, all tokens were removed"})
        } else {
            return res.json({message: "Param 'all' must be specified"})
        }
    } catch (e){
        return res.status(500).json(e)
    }
}

export class loginOrPasswordInvalid extends Error {
    constructor(message) {
        super(message);
        this.name = "LoginPasswordInvalidationError"
    }
}

export {
    signup,
    login,
    logout
}





