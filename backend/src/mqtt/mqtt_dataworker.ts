import MqttClient, {Sensor} from "./mqtt_client";
import DataBase from "../db/db_connection";
import RealtimeRouter from "../api/routes/realtime";

export default class MqttDataWorker {
    private mqtt: MqttClient;
    private database: DataBase;

    constructor(mqtt: MqttClient, database: DataBase) {
        this.mqtt = mqtt;
        this.database = database;

        mqtt.on("newSensor", (sensor: Sensor) => {
            console.log("New Sensor:", sensor.toString());
            database.connectNewSensor(sensor);

            sensor.on("message", (topic: string, messageLabel: string, message: Buffer) => {
                database.collectSensorData(sensor, messageLabel, message);
            });
        });

        mqtt.on("removeSensor", (sensor: Sensor) => {
            database.sensorDead(sensor);
            console.log("Sensor Dead", sensor.uuid);
            RealtimeRouter.events.emit("send", "disconnect", sensor.uuid);
        });
    }


}