import * as dgram from "dgram";
import {request} from "http";
import * as ip from "ip";

export default class SensorDiscovery {

    static socket: dgram.Socket;
    static helloMessage: string = "OwO";
    static address: string;
    static broadcast: string;

    public static setup(discoveryPort: number) {
        this.socket = dgram.createSocket("udp4");

        if (process.env.IP_ADDRESS) {
            this.address = process.env.IP_ADDRESS;
            const netmask = process.env.NETMASK;

            if (netmask) {
                this.broadcast = ip.subnet(this.address, netmask).broadcastAddress;
            } else {
                throw new Error("Netmask for " + this.address + " not found.");
            }
        } else {
            throw new Error("No Ip Address in envs Found");
        }

        console.log("Listening Discovery...")
        this.socket.on("message", (message: Buffer, remote: dgram.RemoteInfo) => {
            if (message.toString() === "UwU") {
                console.log("Device Found:", remote.address + ":" + remote.port);
                request("http://" + remote.address + "/broker?ip=" + this.address, (res) => {
                    console.log("Broker send Responded:", res.statusCode);
                }).end();
            }
        });

        this.socket.bind(discoveryPort);
    }

    public static startDiscovery(discoveryPort: number) {
        console.log("Broadcasting Discovery Hello on", this.broadcast);
        this.socket.setBroadcast(true);
        this.socket.send(SensorDiscovery.helloMessage, 0, SensorDiscovery.helloMessage.length, discoveryPort, this.broadcast);
    }

}