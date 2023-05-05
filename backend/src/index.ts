import * as dotenv from "dotenv";
import MqttClient from "./mqtt/mqtt_client";
import TempiAPI from "./api/tempi_api";
import DataBase from "./db/db_connection";
import MqttDataWorker from "./mqtt/mqtt_dataworker";
import {AddressExtractor} from "./utils/address_extractor";
import {Logger} from "./utils/logger";

dotenv.config();
Logger.createLogger(process.env.LEVEL ?? "info");

if (AddressExtractor.extract()) {

    process.on("uncaughtException", function (err) {
        Logger.error("Caught exception:", err);
    });

    const mqtt = new MqttClient("mqtt://host.docker.internal");
    const database = new DataBase("mysql://root@host.docker.internal", "secret");
    const dataWorker = new MqttDataWorker(mqtt, database);
    const api = new TempiAPI(3000, database, 12666);
    api.serve();

    database.allSensorsDead();
} else {
    Logger.error("Error on Address Extraction");
}