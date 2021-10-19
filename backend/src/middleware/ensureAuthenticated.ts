import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            errorCode: "Token.invalid"
        })
    }

    // Bearer 4546857d89a7d8asdasdfasdas
    // [0] Bearer
    // [1] 4546857d89a7d8asdasdfasdas

    const [, token] = authToken.split(" ")

    try {
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayload

        request.user_id = sub

        return next();
    } catch (err) {
        return response.status(401).json({errorCode: "token.expired"})
    }
}