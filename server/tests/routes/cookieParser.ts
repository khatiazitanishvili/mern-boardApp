import { JSONCookie } from "cookie-parser";
import { IncomingMessage } from "http";
import setCookie from "set-cookie-parser";
import supertest from "supertest";

/**
 * Hilfsfunktion, um mit SuperTest leichter auf die Cookies zugreifen zu können.
 * Anwendungsbeispiel:
 * ```
 * const request = supertest(app);
 * const response = parseCookies(await request.post(`/login`).send({ email: "john@some-host.de", password: "1234" }));
 * const jwtString = response.cookies.access_token;
 * const payload = verify(jwtString as string, process.env.JWT_SECRET!)
 * expect(payload.sub).toBe(john.id);
 * ```
 * 
 * @param response Response von SuperTest
 * @returns gleiche Response mit neuem Property cookies, in dem die Cookies 
 *      wie beim Request in express mit installiertem cookieParser zu Verfügung stehen 
 */
export function parseCookies(response: supertest.Response): supertest.Response & { cookies: { [key: string]: object | string } } {
    const cookiesAsArray = setCookie.parse((response as unknown as { res: IncomingMessage }).res);
    const cookies: { [key: string]: object | string } = {};
    for (const cookie of cookiesAsArray) {
        const value = JSONCookie(cookie.value);
        if (value) {
            cookies[cookie.name] = value;
        } else if (cookie.value) {
            cookies[cookie.name] = cookie.value;
        }
    }
    const extendedResponse = response as supertest.Response & { cookies: { [key: string]: object | string } };
    extendedResponse.cookies = cookies;
    return extendedResponse;
}

/**
 * Liefert Cookie mit allen Properties, insbesondere `httpOnly`.
 * Anwendungsbeispiel:
 * ```
 * const request = supertest(app);
 * const response = await request.post(`/login`).send({ email: "john@some-host.de", password: "1234" });
 * expect(getCookie(response, "access_token")?.httpOnly).toBeTruthy();
 * ```
 * @param response Response von SuperTest
 * @returns Cookie mit Eigenschaften, vgl. {@link setCookie.Cookie}
 */
export function getCookie(response: supertest.Response, nameOfCookie: string): setCookie.Cookie {
    const cookiesAsMap = setCookie.parse((response as unknown as { res: IncomingMessage }).res, { map: true });
    return cookiesAsMap[nameOfCookie];
}