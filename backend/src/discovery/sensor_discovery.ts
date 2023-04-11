import * as dgram from "dgram";
import {request} from "http";
import {AddressExtractor} from "../utils/address_extractor";

export default class SensorDiscovery {

    static socket: dgram.Socket;
    static helloMessage: string = "OwO";

    public static setup(discoveryPort: number) {
        this.socket = dgram.createSocket("udp4");

        this.socket.on("message", (message: Buffer, remote: dgram.RemoteInfo) => {
            console.log("Receive Discovery Answer", remote.address + ":" + remote.port, "-", message.toString());
            if (message.toString().startsWith("UwU")) {
                const address = message.toString().split("+")[1];
                console.log("Device Found:", address + ":" + remote.port);
                request("http://" + address + "/broker?ip=" + AddressExtractor.address, (res) => {
                    console.log("Broker send Responded:", res.statusCode);
                }).end();
            }
        });

        this.socket.on("listening", () => {
            const address = this.socket.address();
            console.log(`Listening Discovery... ${address.address}:${address.port}`);
        });

        this.socket.bind(discoveryPort);
    }

    public static async startDiscovery(discoveryPort: number) {
        console.log("Broadcasting Discovery Hello on", AddressExtractor.broadcast);
        this.socket.setBroadcast(true);
        this.socket.send(SensorDiscovery.helloMessage, 0, SensorDiscovery.helloMessage.length, discoveryPort, AddressExtractor.broadcast);

        return {found: 0};
    }

}