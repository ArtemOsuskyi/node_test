import {User} from "../entity/User";
import {sign, verify} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

const createToken = (user: User) => {
    return sign({id: user.username, idType: user.idType}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m"
    })
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({message: "Token is expired"})
        req.user = user
        next()
    })
}

export {
    createToken,
    verifyToken
}

