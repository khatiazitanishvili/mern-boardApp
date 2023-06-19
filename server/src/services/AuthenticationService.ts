import { User } from "../model/UserModel"
import jwt, { JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()




/**
 * Prüft Email und Passwort, bei Erfolg wird ein String mit einem JWT-Token zurückgegeben.
 *  
 * Die zur Unterzeichnung notwendige Passphrase wird aus der Umgebungsvariable `JWT_SECRET` gelesen,
 * falls diese nicht gesetzt ist, wird ein Fehler geworfen.
 * Die Zeitspanne, die das JWT gültig ist, also die 'Time To Live`, kurz TTL, wird der Umgebungsvariablen
 * `JWT_TTL` entnommen. Auch hier wird ein Fehler geworfen, falls diese Variable nicht gesetzt ist.
 * 
 * @param email E-Mail-Adresse des Users
 * @param password Das Passwort des Users
 * @returns String mit JWT (im JWT ist sub gesetzt mit der Mongo-ID des Users als String); 
 *      oder undefined wenn Authentifizierung fehlschlägt.
 */
export async function verifyPasswordAndCreateJWT(email: string, password: string): Promise<string | undefined> {
    const user = await User.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
        throw new Error("invalid EMail")
    }

    const isCorrectPass = await user.isCorrectPassword(password)
    if (!isCorrectPass) {
        throw new Error("invalid Password")
    }

    const payload: JwtPayload = {
        sub: user._id.toString(),

    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET must be defined')
    }
    const ttl = process.env.JWT_TTL
        ? parseInt(process.env.JWT_TTL)
        : 300 // 5 minutes;

    if (!ttl) {
        throw new Error('JWT_TTL must be defined')
    }

    const jwtString = jwt.sign(
        payload,
        secret,
        {
            expiresIn: ttl,
            algorithm: "HS256"
        }
    )
    if (!jwtString) {
        throw new Error("variable Time To Live is undefined")
    }

    return jwtString
}


/**
 * Gibt user id (Mongo-ID) zurück, falls Verifizierung erfolgreich, sonst wird ein Error geworfen.
 * 
 * Die zur Prüfung der Signatur notwendige Passphrase wird aus der Umgebungsvariable `JWT_SECRET` gelesen,
 * falls diese nicht gesetzt ist, wird ein Fehler geworfen.
 * 
 * @param jwtString das JWT
 * @return user id des Users (Mongo ID als String)
 */
export function verifyJWT(jwtString: string | undefined): string {
    if (!jwtString) {
        throw new Error('JWT is undifined')
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('secret is undifined')
    }

    const encoded = verify(
        jwtString,
        secret,
        { algorithms: ["HS256"] }
    ) as JwtPayload;


    if (!encoded) {
        throw new Error('cannot verify JWT')
    }
    if (!encoded.sub) {
        throw new Error('cannot verify JWT')

    }
    return encoded.sub;

}



