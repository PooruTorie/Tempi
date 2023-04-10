import * as dotenv from "dotenv";
import MqttClient from "./mqtt/mqtt_client";
import TempiAPI from "./api/tempi_api";
import DataBase from "./db/db_connection";
import MqttDataWorker from "./mqtt/mqtt_dataworker";

dotenv.config();

process.on("uncaughtException", function (err) {
    console.error("Caught exception:", err);
});

const mqtt = new MqttClient("mqtt://broker");
const database = new DataBase("mysql://root@db", "secret");
const dataWorker = new MqttDataWorker(mqtt, database);
const api = new TempiAPI(3000, database, 12666);
api.serve();

database.allSensorsDead();