import * as Hapi from "hapi";
import mongoose = require("mongoose");
import "reflect-metadata";
import { iocRegister, LoadPlugins, serverConfig } from "./config";

async function startServer(): Promise<any> {
    const server = new Hapi.Server({
        debug: { request: ["error"] },
        port: serverConfig.port,
        routes: {
            cors: {
                origin: ["*"]
            }
        }
    });

    LoadPlugins(server);
    iocRegister(server);

    (mongoose as any).Promise = Promise;
    await mongoose.connect(serverConfig.databaseURL,
        { useNewUrlParser: true});

    console.log("database connection -- OK");

    await server.start();
    console.log("Server running at:", server.info.uri);
}

startServer();
