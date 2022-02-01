import {Request, Response} from "express";
import {getLatency} from "../services/LatencyService";

const latency = async (req: Request, res: Response) => {
    const result = await getLatency()
    return res.json({result})
}

export {latency};