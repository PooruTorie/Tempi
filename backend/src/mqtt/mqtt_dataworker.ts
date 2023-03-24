import MqttClient from "./mqtt_client";
import DataBase from "../db/db_connection";

export default class MqttDataWorker {
    private mqtt: MqttClient;
    private database: DataBase;

    constructor(mqtt: MqttClient, database: DataBase) {
        this.mqtt = mqtt;
        this.database = database;

        mqtt.on("newSensor", (sensor) => {
            console.log("New Sensor:", sensor);
            sensor.on("message", (topic: string, message: Buffer) => {
                database.collectSensorData(sensor, message);
            });
        });
    }


}