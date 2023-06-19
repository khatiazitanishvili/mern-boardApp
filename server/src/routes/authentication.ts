import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../services/AuthenticationService";

declare global {
    namespace Express {
        export interface Request {
            /**
             * Mongo-ID of currently logged in user; or undefined, if user is a guest.
             */
            userId?: string;
        }
    }
}

/**
 * Prüft Authentifizierung und schreibt `userId` mit Mongo-ID des Users in den Request.
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) erzeugt.
 * Das JWT wird in einem Cookie 'access_token' erwartet.
 */
export async function requiresAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
        const jwtString = req.cookies.access_token;
        const userId = verifyJWT(jwtString)
        req.userId = userId;
        next();
    } catch (err) {
        res.status(401);
        next(err);
    }
}


/**
 * Prüft Authentifizierung und schreibt `userId` mit Mongo-ID des Users in den Request.
 * Falls Authentifizierung fehlschlägt, wird kein Fehler erzeugt.
 * Das JWT wird in einem Cookie 'access_token' erwartet.
 */
export async function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
    const jwtString = req.cookies.access_token;
    if (!jwtString) {
        next();
        return;
    }
    try {
        const userId = verifyJWT(jwtString)
        req.userId = userId;
    }

    // const userId = verifyJWT(jwtString)
    // req.userId = userId;
    finally {
        next();
    }

}