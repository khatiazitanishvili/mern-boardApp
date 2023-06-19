import { readFile } from "fs/promises";
import https from "https";
import app from "../../src/app";
import { createJohnsBoard } from "../../src/prefill";
import DB from "../DB";
import { jwtSuperTest, prepareJWTAccessToken } from "../routes/JWTPreparedSuperTest";
import "jest-extended"


beforeAll(async () => { await DB.connect(); })
afterEach(async () => { await DB.clear(); })
afterAll(async () => {
    await DB.close()
})

const TEST_HTTPS_PORT = process.env.TEST_HTTPS_PORT ?? "3002";
const TEST_SSL_KEY_FILE = process.env.TEST_SSL_KEY_FILE ?? "cert/private.key"
const TEST_SSL_CERT_FILE = process.env.TEST_SSL_CERT_FILE ?? "cert/public.crt"

test("https test", async () => {
    // setup a nice board
    const board = await createJohnsBoard()
    await prepareJWTAccessToken("john@some-host.de", "1234");

    // https://nodejs.org/api/cli.html#node_tls_reject_unauthorizedvalue
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // set up server:
    const httpsPort = parseInt(TEST_HTTPS_PORT);
    const [privateSSLKey, publicSSLCert] = await Promise.all([
        readFile(TEST_SSL_KEY_FILE),
        readFile(TEST_SSL_CERT_FILE)]);

    const httpsServer = https.createServer(
        { key: privateSSLKey, cert: publicSSLCert },
        app);
    try {
        await new Promise<void>((resolve, reject) => {
            try {
                /*
                 * Bei einem Fehler "listen EADDRINUSE: address already in use :::3002", 
                 * meist verursacht durch fehlgeschlagene Tests,
                 * kann man (unter Linux und macos) den zugehörigen Prozess, sprich, die noch im Hintergrund
                 * laufende Node-Instanz mit
                 * > lsof -ti :3002
                 * identifizieren. Ausgegeben wird die Nummer des Prozesses, diesen kann man dann mit
                 * > kill «Prozessnummer»
                 * beenden.
                 * Oder als Einzeiler:
                 * > kill $(lsof -ti :3002)
                 * Achtung, es kann sein, dass die Jest-Extension immer wieder neue Tests
                 * gescheduled hat. Dann wird der Port immer wieder neu belegt.
                 */
                httpsServer.listen(httpsPort, () => {
                    // console.log(`Listening for HTTPS at https://localhost:${httpsPort}`);
                    resolve(/* void */);
                });
            } catch (err) {
                reject(err);
            }
        });
        // get that nice board
        const request = jwtSuperTest(httpsServer);
        const response = await request.get(`/board`);
        expect(response.statusCode).toBe(200);
        const boardRes = response.body;
        // toIncludeAllMembers kommt von jest-extended, die Reihenfolge spielt hierbei keine Rolle
        expect(boardRes.channels).toIncludeAllMembers(board.channels);
    } finally {
        httpsServer.close();
    }
});