import MqttClient from "./mqtt/mqtt_client";
import TempiAPI from "./api/tempi_api";
import DataBase from "./db/db_connection";
import MqttDataWorker from "./mqtt/mqtt_dataworker";

const mqtt = new MqttClient("mqtt://localhost");
const database = new DataBase("mysql://root@localhost", "secret");
const dataWorker = new MqttDataWorker(mqtt, database);
const api = new TempiAPI(3000, database, 12666);
api.serve();