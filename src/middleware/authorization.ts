import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const secret = process.env.SECRET_KEY as string;

export const authetocatingToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.headers['authorization'];
    const token =  authHeaders?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized access'
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
        req.body = decoded;
        next();
    });

    
}