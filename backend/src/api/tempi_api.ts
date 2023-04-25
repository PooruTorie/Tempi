// @ts-ignore
import express, {Express, Router} from "express";
import DataBase from "../db/db_connection";

import SensorRouter from "./routes/sensor";
import SensorDiscovery from "../discovery/sensor_discovery";
import * as bodyParser from "body-parser";
import RealtimeRouter from "./routes/realtime";
import {Logger} from "../utils/logger";
import * as log4js from "log4js";

export default class TempiAPI {
    public database: DataBase;
    private app: Express;
    private readonly port: number;

    constructor(port: number, database: DataBase, discoveryPort: number) {
        this.app = express();
        this.port = port;
        this.database = database;

        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({extended: false}))

        // parse application/json
        this.app.use(bodyParser.json())

        // add logger
        this.app.use(log4js.connectLogger(log4js.getLogger("api"), {level: "debug"}));

        SensorDiscovery.setup(discoveryPort);

        this.app.get("/api/discover", async (req, res) => {
            res.json(await SensorDiscovery.startDiscovery(discoveryPort));
        });
        this.app.use("/api" + SensorRouter.route, new SensorRouter(this).get());
        this.app.use("/api" + RealtimeRouter.route, new RealtimeRouter(this).get());
    }

    serve() {
        this.app.listen(this.port, () => {
            Logger.info("Backend running on port: " + this.port);
        });
    }
}