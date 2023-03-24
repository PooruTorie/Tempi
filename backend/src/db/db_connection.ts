import {createPool, Pool} from "mysql2/promise";
import {Sensor} from "../mqtt/mqtt_client";

export default class DataBase {
    private connection: Pool;

    constructor(host: string, password: string) {
        this.connection = createPool({
            uri: host,
            password: password,
            database: "tempi",
            charset: "utf8"
        });
    }

    collectSensorData(sensor: Sensor, message: Buffer) {
        this.connection.execute("")
        console.log(sensor, message)
    }
}