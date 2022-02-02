import {Request, Response} from "express";
import {verify} from "jsonwebtoken";
import {
    idTaken,
    invalidIdFormat, invalidToken,
    loginOrPasswordInvalid,
    register,
    signin,
    signout,
    signoutAll
} from "../services/AuthService";


const signup = async (req: Request, res: Response) => {  //registration

    const {username, password} = req.body

    await register(username, password)
        .then((newUser) => {
            res.header('Token', newUser.token)
            return res.status(200).json({message: "Signup successful"})
        })
        .catch((e) => {
                if (e instanceof idTaken) return res.status(400).json({error: e.name, message: e.message})
                else if (e instanceof invalidIdFormat) return res.status(400).json({error: e.name, message: e.message})
                else return res.status(500).json({message: "Something gone wrong, please try again"})
            }
        )
}

const login = async (req: Request, res: Response) => {  //login

    const {username, password} = req.body

    await signin(username, password)
        .then((loginUser) => {
            res.header('Token', loginUser.token)
            return res.status(200).json({message: "Login successful"})
            })
        .catch( (e) => {
            if(e instanceof loginOrPasswordInvalid)
                return res.status(400).json({error: e.name, message: e.message})
            else
                return res.status(500).json({message: "Something gone wrong, please try again"})
        })
}

const logout = async (req: Request, res: Response) => {  //logout

    const header = req.headers['authorization']
    const headerToken = header.split(' ')[1]

    if(req.query.all === "false") {
        verify(headerToken, process.env.ACCESS_TOKEN_SECRET, async (err) => {
            if (err) {
                return res.status(400).json({message: "Token is already expired"})
            }
        })
        await signout(headerToken).then(() => {
            res.json({message: "Logout successful"})
        }).catch( (e) => {
            if(e instanceof  invalidToken) return res.status(403).json({error: e.name, message: e.message})
        })
    } else if (req.query.all === "true"){
        verify(headerToken, process.env.ACCESS_TOKEN_SECRET, async (err) => {
            if (err) {
                return res.status(400).json({message: "Token is already expired"})
            }
        })
        await signoutAll(headerToken).then(() => {
            return res.json({message: "Logout successful, all tokens were removed"})
        }).catch((e) => {
            if(e instanceof  invalidToken) return res.status(403).json({error: e.name, message: e.message})
        })
    } else {
        return res.json({message: "Param 'all' must be specified"})
    }
}

export {
    signup,
    login,
    logout
}






