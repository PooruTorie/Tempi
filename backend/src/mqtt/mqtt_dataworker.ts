import MqttClient, {Sensor} from "./mqtt_client";
import DataBase from "../db/db_connection";

export default class MqttDataWorker {
    private mqtt: MqttClient;
    private database: DataBase;

    constructor(mqtt: MqttClient, database: DataBase) {
        this.mqtt = mqtt;
        this.database = database;

        mqtt.on("newSensor", (sensor: Sensor) => {
            console.log("New Sensor:", sensor.toString());
            database.connectNewSensor(sensor);
            sensor.on("message", (topic: string, message: Buffer) => {
                const messageLabel: string = topic.replace(sensor.topic + "/", "");
                database.collectSensorData(sensor, messageLabel, message);
            });
        });
    }


}