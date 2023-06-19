/* istanbul ignore file */
import { readFile } from "fs/promises";
import http from "http";
import https from "https";
import mongoose from 'mongoose';
import app from "./app";

import dotenv from "dotenv";
import { prefillDB } from "./prefill";
dotenv.config() // read ".env"

async function setup() {

    let mongodURI = process.env.DB_CONNECTION_STRING;
    if (!mongodURI) {
        console.error(`Cannot start, no database configured. Set environment variable DB_CONNECTION_STRING. Use "memory" for MongoMemoryServer`);
        process.exit(1);
    }
    if (mongodURI === "memory") {
        console.log("Start MongoMemoryServer")
        const MMS = await import('mongodb-memory-server')
        const mongo = await MMS.MongoMemoryServer.create();
        mongodURI = mongo.getUri();
        if (process.env.DB_PREFILL == "true") {
            prefillDB();
        }
    }


    console.log(`Connect to mongod at ${mongodURI}`)
    await mongoose.connect(mongodURI);

    if ((process.env.USE_SSL == "true")) {

        const [privateSSLKey, publicSSLCert] = await Promise.all([
            readFile(process.env.SSL_KEY_FILE!),
            readFile(process.env.SSL_CERT_FILE!)
        ]);

        const httpsServer = https.createServer({ key: privateSSLKey, cert: publicSSLCert }, app);
        httpsServer.listen(process.env.HTTPS_PORT, () => {
            console.log(`Listening for HTTPS at https://localhost:${process.env.HTTPS_PORT}`);
        });
    }
    else {
        const port = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3000;
        const httpServer = http.createServer(app);
        httpServer.listen(port, () => {
            console.log(`Listening for HTTP at http://localhost:${port}`);
        });
    }
};

setup();