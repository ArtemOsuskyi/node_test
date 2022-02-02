import {getRepository} from "typeorm";
import {decode} from "jsonwebtoken";
import {createToken} from './SecurityService'

import * as bcrypt from 'bcrypt'

import {Token} from "../entity/Token";
import {User} from "../entity/User";

const emailPattern: RegExp = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
const phonePattern: RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

const register = async (username: string, password: string) => {
    const userRepository = getRepository(User)
    const tokenRepository = getRepository(Token)

    const user = new User();
    user.username = username

    const hashedPassword = await bcrypt.hash(password, 12)  //hashing password

    const takenEmailOrNumber = await userRepository.findOne(user)  //checking if such username already exists...
    if(takenEmailOrNumber) throw new idTaken("This ID is already taken")  //...if true, throw error
    user.password = hashedPassword

    //checking if given username is email, if true - set according type of id
    if (emailPattern.test(username)) user.idType = "email"
    //checking if given username is phone number, if true - set according type of id
    else if (phonePattern.test(username)) user.idType = "phone number"
    else throw new invalidIdFormat("Incorrect ID format")

    const token = new Token()
    token.token = createToken(user)  //generating token for registering user
    const tokenPayload = decode(token.token)  //decoding token to get the expiry date

    token.expireDate = new Date(tokenPayload['exp'] * 1000)
    token.owner = user  //set registering user as an owner of new token

    await tokenRepository.save(token)  //saving token
    await userRepository.save(user)  //saving user

    return token
}

const signin = async (username: string, password: string) => {  //login

    const userRepository = getRepository(User)
    const tokenRepository = getRepository(Token)

    const userModel = new User()
    userModel.username = username

    const user = await userRepository.findOne(userModel)  //searching for a given user in DB...
    if(!user) throw new loginOrPasswordInvalid("Username or password are invalid")//...if not found, throw error

    const dbPassword = user.password
    const passMatch = bcrypt.compareSync(password, dbPassword)  //comparing given password with a password in DB...
    if(!passMatch) throw new loginOrPasswordInvalid("Username or password are invalid")//...if not match, throw error

    const accessToken = new Token()
    accessToken.token = createToken(user)  //generating token for a given user
    const tokenPayload = decode(accessToken.token)  //decoding token to get the expiry date

    //converting token expiry date to JSON date format
    accessToken.expireDate = new Date(tokenPayload['exp'] * 1000)
    accessToken.owner = user  //set registering user as an owner of new token

    await tokenRepository.save(accessToken)  //saving new token
    await userRepository.update(user, user)  //updating user

    return accessToken
}

const signout = async (token: string) => {
    const tokenRepository = getRepository(Token)

    const newToken = new Token()
    newToken.token = token

    const removeToken = await tokenRepository.findOne(newToken)  //checking if given token exists...
    if (!removeToken) throw new invalidToken("Token doesn't exist")  //...if not, throw error

    await tokenRepository.remove(removeToken)  //remove current token
}

const signoutAll = async (token: string) => {
    const tokenRepository = getRepository(Token)

    await signout(token)  //remove current token

    const removeToken = await tokenRepository.find()
    await tokenRepository.remove(removeToken)
}

export class loginOrPasswordInvalid extends Error {
    constructor(message) {
        super(message);
        this.name = "LoginPasswordInvalidationError"
    }
}


export class idTaken extends Error{
    constructor(message) {
        super(message);
        this.name = "IdTakenError"
    }
}


export class invalidIdFormat extends Error{
    constructor(message) {
        super(message);
        this.name = "InvalidIdFormatError"
    }

}

export class invalidToken extends Error{
    constructor(message) {
        super(message);
        this.name = "InvalidTokenError"
    }
}

export {
    register,
    signin,
    signout,
    signoutAll
}





