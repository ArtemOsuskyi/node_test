import {Request, Response} from "express";

const info = (req: Request, res: Response) => {
    return res.json({id: req.user.id, id_type: req.user.id_type})
}

export {info}
