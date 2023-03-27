import * as mqtt from "mqtt";
import {EventEmitter} from "events";

export default class MqttClient extends EventEmitter {
    private connection: mqtt.MqttClient;
    private sensors: Sensor[] = [];

    constructor(host: string) {
        super();
        this.connection = mqtt.connect(host, {
            clientId: "tempi-backend"
        });
        this.connection.on("error", (error) => {
            console.log("Can't connect" + error);
        });
        this.connection.on("connect", () => {
            this.connection.subscribe("tempi/device");
            this.connection.on("message", (topic, message) => {
                if (topic === "tempi/device") {
                    this.registerNewSensor(JSON.parse(message.toString()));
                    return;
                }
                this.emit("message", topic, message);
            });
        });
    }

    public getSensors(): Sensor[] {
        return this.sensors;
    }

    subscribe(topic: string) {
        this.connection.subscribe(topic);
    }

    private registerNewSensor(data: { uuid: string, ip: string }) {
        const sensor = new Sensor(this, data.uuid, data.ip);
        this.sensors.push(sensor);
        this.emit("newSensor", sensor);
    }
}

export class Sensor extends EventEmitter {
    private uuid: string;
    private ip: string;
    private connection: MqttClient;
    private readonly topic: string;

    constructor(connection: MqttClient, uuid: string, ip: string) {
        super();
        this.connection = connection;
        this.topic = "tempi/sensor/" + uuid;
        this.uuid = uuid;
        this.ip = ip;

        connection.subscribe(this.topic + "/#");
        connection.on("message", (topic, message) => {
            if (topic.startsWith(this.topic)) {
                this.emit("message", topic, message);
            }
        });
    }
}