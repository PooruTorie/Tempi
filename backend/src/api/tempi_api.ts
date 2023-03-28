// @ts-ignore
import express, {Express} from "express";
import DataBase from "../db/db_connection";
import {lookup} from "dns";
import {hostname} from "os";

import SensorRouter from "./routes/sensor";
import SensorDiscovery from "../discovery/sensor_discovery";

export default class TempiAPI {
    public database: DataBase;
    private app: Express;
    private readonly port: number;

    constructor(port: number, database: DataBase, discoveryPort: number) {
        this.app = express();
        this.port = port;
        this.database = database;

        this.app.get("/discover", async (req, res) => {
            const brokerIp: string = await new Promise<string>((resolve) => lookup(hostname(), (err, address) => resolve(address)));
            await SensorDiscovery.startDiscovery(brokerIp, discoveryPort);
            res.json({success: true});
        });
        this.app.use(SensorRouter.route, new SensorRouter(this).get());
    }

    serve() {
        this.app.listen(this.port, () => {
            console.log("Backend running on port: " + this.port);
        });
    }
}