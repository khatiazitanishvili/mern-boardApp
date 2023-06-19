import express from "express";
import { body, matchedData, validationResult } from "express-validator";
import { User } from "../model/UserModel";
import { verifyPasswordAndCreateJWT } from "../services/AuthenticationService";
import { optionalAuthentication, requiresAuthentication } from "./authentication";

const loginRouter = express.Router();

/**
 * Zur Demo im Browser.
 */
loginRouter.get("/", (req, res) => {
    res.set('Content-Type', 'text/html')
        .status(200)
        .send(`<html><body><form action="login" method="post">
    <label for="userid">EMail:</label><input type="text" name="email" id=email"><br />
    <label for="password">Passwort:</label><input type="password" name="password" id=“password"><br />
    <input type="submit" value="Login via POST">
</form></body><html>`)
});

/**
 * Führt einen Login durch. Im Erfolgsfall wird dem Client ein 
 * HTTPOnly-Cookie 'access_token' mit dem JWT gesendet.
 */
loginRouter.post("/",
    body("email").isEmail().normalizeEmail(),
    body("password").isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json({ errors: errors.array() });
        }

        // const email = req.body.email;
        // const pass = req.body.password;
        try {
            const log = matchedData(req) as { email: string, password: string }
            const jwtTokenString = await verifyPasswordAndCreateJWT(log.email, log.password);
            res.cookie("access_token", jwtTokenString, { httpOnly: false })
            res.sendStatus(200);
        } catch (err) {
            res.status(404)
            next(err);
        }
    });


export async function login(email: string, password: string): Promise<{ success: boolean, id?: string, name?: string }> {
    const user = await User.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
        return { success: false }
    }
    const isCorrectPass = await user.isCorrectPassword(password)
    if (!await user.isCorrectPassword(password)) {
        return { success: false }
    }
    return {
        success: true,
        id: user.id,
        name: user.name
    }
}
export default loginRouter;