import * as mqtt from "mqtt";
import {EventEmitter} from "events";
import axios from "axios";
import {clearInterval} from "timers";

export default class MqttClient extends EventEmitter {
    private connection: mqtt.MqttClient;
    private sensors: Sensor[] = [];

    constructor(host: string) {
        super();
        this.setMaxListeners(50);
        this.connection = mqtt.connect(host, {
            port: 1883,
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

    unsubscribe(topic: string) {
        this.connection.unsubscribe(topic);
    }

    private registerNewSensor(data: { uuid: string, ip: string }) {
        if (!this.sensors.find(sensor => sensor.uuid == data.uuid)) {
            const sensor = new Sensor(this, data.uuid, data.ip, () => {
                this.sensors.push(sensor);
                this.emit("newSensor", sensor);
            });
            sensor.on("disconnect", () => {
                this.sensors = this.sensors.filter(s => s.uuid !== sensor.uuid);
                this.emit("removeSensor", sensor);
            });
        }
    }
}

export class Sensor extends EventEmitter {
    private connection: MqttClient;
    private readonly _topic: string;
    private readonly _uuid: string;
    private _version: string = "x.x.x";
    private _alive: number = 10;
    private readonly _aliveInterval: NodeJS.Timer;

    constructor(connection: MqttClient, uuid: string, ip: string, initCallback: Function) {
        super();
        this.setMaxListeners(50);
        this.connection = connection;
        this._topic = "tempi/sensor/" + uuid;
        this._uuid = uuid;
        this._ip = ip;

        connection.subscribe(this._topic + "/#");
        connection.on("message", (topic, message) => {
            if (topic.startsWith(this._topic)) {
                if (messageLabel === "keepalive") {
                    console.log("Sensor Alive", sensor.uuid);
                    sensor.alive(message.toString());
                    database.sensorAlive(sensor);
                } else {
                    this.emit("message", topic, message);
                }
            }
        });
        this.requestConfiguration().then(() => initCallback());

        this._aliveInterval = setInterval(() => {
            if (this._alive < 0) {
                clearInterval(this._aliveInterval);
                connection.unsubscribe(this._topic + "/#");
                this.emit("disconnect");
            }
            this._alive--;
        }, 1000);
    }

    private _ip: string;

    get ip(): string {
        return this._ip;
    }

    private _type: string = "not_detected";

    get type(): string {
        return this._type;
    }

    get uuid(): string {
        return this._uuid;
    }

    get topic(): string {
        return this._topic;
    }

    get firmwareVersion(): string {
        return this._version;
    }

    toString() {
        return "Sensor{" +
            "ip: " + this._ip +
            ", uuid: " + this._uuid +
            ", topic: " + this._topic +
            "}";
    }

    alive(ip: string) {
        this._ip = ip;
        this._alive = 10;
    }

    toObject(name: string) {
        return {
            uuid: this.uuid,
            type: this.type,
            version: this.firmwareVersion,
            ip: this.ip,
            name
        }
    }

    private async requestConfiguration() {
        const res = await axios.get("http://" + this._ip + "/");
        this._version = res.data.version;
        this._type = res.data.type;
    }
}