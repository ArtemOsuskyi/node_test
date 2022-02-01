import {Request, Response} from "express";

const info = (req: Request, res: Response) => {
    res.json({id: req.user.id, id_type: req.user.id_type})
}

export {info}
