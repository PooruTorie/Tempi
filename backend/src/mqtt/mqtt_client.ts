import * as mqtt from "mqtt";
import {EventEmitter} from "events";

export default class MqttClient extends EventEmitter {
    private connection: mqtt.MqttClient;
    private sensors: Sensor[] = [];

    constructor(host: string) {
        super();
        this.connection = mqtt.connect(host, {
            port: 11883,
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
    private connection: MqttClient;
    private readonly _topic: string;
    private readonly _uuid: string;
    private readonly _ip: string;

    constructor(connection: MqttClient, uuid: string, ip: string) {
        super();
        this.connection = connection;
        this._topic = "tempi/sensor/" + uuid;
        this._uuid = uuid;
        this._ip = ip;

        connection.subscribe(this._topic + "/#");
        connection.on("message", (topic, message) => {
            if (topic.startsWith(this._topic)) {
                this.emit("message", topic, message);
            }
        });
    }

    get uuid(): string {
        return this._uuid;
    }

    get ip(): string {
        return this._ip;
    }

    get topic(): string {
        return this._topic;
    }

    toString() {
        return "Sensor{" +
            "ip: " + this._ip +
            ", uuid: " + this._uuid +
            ", topic: " + this._topic +
            "}";
    }
}