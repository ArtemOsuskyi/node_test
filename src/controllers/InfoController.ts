import {Request, Response} from "express";

const info = (req: Request, res: Response) => {
    return res.json({id: req.user.id, idType: req.user.idType})
}

export {info}
