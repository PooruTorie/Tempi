// @ts-ignore
import express, {Express} from "express";
import DataBase from "../db/db_connection";

import SensorRouter from "./routes/sensor";

export default class TempiAPI {
    public database: DataBase;
    private app: Express;
    private readonly port: number;

    constructor(port: number, database: DataBase) {
        this.app = express();
        this.port = port;
        this.database = database;

        this.app.use(SensorRouter.route, new SensorRouter(this).get());
    }

    serve() {
        this.app.listen(this.port, () => {
            console.log("Backend running on port: " + this.port);
        });
    }
}