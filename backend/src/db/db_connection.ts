import {createPool, Pool, RowDataPacket} from "mysql2/promise";
import {Sensor} from "../mqtt/mqtt_client";
import RealtimeRouter from "../api/routes/realtime";

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
        RealtimeRouter.events.emit("send", messageLabel, message);
    }

    async connectNewSensor(sensor: Sensor) {
        if (await this.isKnown(sensor)) {
            this.connection.execute(
                "UPDATE Sensor SET connected=:ip, version=:version, type=:type, lastConnect=CURRENT_TIMESTAMP() WHERE uuid=:uuid",
                {
                    uuid: sensor.uuid, ip: sensor.ip,
                    type: sensor.type,
                    version: sensor.firmwareVersion
                }
            );
        } else {
            if (await this.isNew(sensor)) {
                RealtimeRouter.events.emit("send", "new", sensor.uuid);
                this.connection.execute(
                    "INSERT INTO Sensor (uuid, connected, version, type) VALUES (:uuid, :ip, :version, :type)",
                    {
                        uuid: sensor.uuid,
                        ip: sensor.ip,
                        type: sensor.type,
                        version: sensor.firmwareVersion
                    }
                );
            }
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

    async getConnectedSensors() {
        const [rows, fields] = await this.connection.query<RowDataPacket[]>(
            "SELECT * FROM Sensor WHERE name IS NOT NULL AND connected IS NOT NULL"
        );
        return rows;
    }

    private async isNew(sensor: Sensor) {
        const [rows, fields] = await this.connection.query<RowDataPacket[]>(
            "SELECT uuid FROM Sensor WHERE uuid=:uuid LIMIT 1",
            {uuid: sensor.uuid}
        );
        return rows.length == 0;
    }
}