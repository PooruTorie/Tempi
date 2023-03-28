import {createPool, Pool, RowDataPacket} from "mysql2/promise";
import {Sensor} from "../mqtt/mqtt_client";

export default class DataBase {
    private connection: Pool;

    constructor(host: string, password: string) {
        this.connection = createPool({
            uri: host,
            namedPlaceholders: true,
            password: password,
            database: "tempi",
            charset: "utf8"
        });
    }

    async isKnown(sensor: Sensor): Promise<boolean> {
        const [rows, fields] = await this.connection.query<RowDataPacket[]>(
            "SELECT uuid FROM Sensor WHERE uuid=:uuid AND name IS NOT NULL LIMIT 1",
            {uuid: sensor.uuid}
        );
        return rows.length > 0;
    }

    collectSensorData(sensor: Sensor, messageLabel: string, message: Buffer) {
        this.connection.execute(
            "INSERT INTO SensorData (sensor, value, label) VALUES (:uuid, :value, :label)",
            {
                uuid: sensor.uuid,
                value: message,
                label: messageLabel
            }
        );
        console.log(sensor, message);
    }

    async connectNewSensor(sensor: Sensor) {
        if (await this.isKnown(sensor)) {
            this.connection.execute(
                "UPDATE Sensor SET lastConnect=CURRENT_TIMESTAMP() WHERE uuid=:uuid",
                {uuid: sensor.uuid}
            );
        } else {
            this.connection.execute(
                "INSERT IGNORE INTO Sensor (uuid) VALUES (:uuid)",
                {uuid: sensor.uuid}
            );
        }
    }

    async getNewSensors(): Promise<string[]> {
        const [rows, fields] = await this.connection.query<RowDataPacket[]>(
            "SELECT uuid FROM Sensor WHERE name IS NULL"
        );
        return rows.map(value => value.uuid);
    }

    setName(uuid: string, name: string) {
        this.connection.execute(
            "UPDATE Sensor SET name=:name WHERE uuid=:uuid",
            {uuid, name}
        );
    }

    async checkUUID(uuid: string) {
        const [rows, fields] = await this.connection.query<RowDataPacket[]>(
            "SELECT uuid FROM Sensor WHERE uuid=:uuid LIMIT 1",
            {uuid: uuid}
        );
        return rows.length > 0;
    }
}