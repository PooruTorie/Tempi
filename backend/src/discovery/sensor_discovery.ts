import * as dgram from "dgram";
import {request} from "http";
import * as ip from "ip";

export default class SensorDiscovery {

    static socket: dgram.Socket;
    static helloMessage: string = "OwO";

    public static setup(discoveryPort: number) {
        this.socket = dgram.createSocket("udp4");

        const address: string = ip.address();

        console.log("Listening Discovery...")
        this.socket.on("message", (message: Buffer, remote: dgram.RemoteInfo) => {
            if (message.toString() === "UwU") {
                console.log("Device Found:", remote.address + ":" + remote.port);
                request("http://" + remote.address + "/broker?ip=" + address, (res) => {
                    console.log("Broker send Responded:", res.statusCode);
                }).end();
            }
        });

        this.socket.bind(discoveryPort);
    }

    public static startDiscovery(discoveryPort: number) {
        const netInterface = ip.networkInterface();
        const broadcastAddress: string = ip.subnet(netInterface.address, netInterface.netmask).broadcastAddress;

        console.log("Broadcasting Discovery Hello");
        this.socket.setBroadcast(true);
        this.socket.send(SensorDiscovery.helloMessage, 0, SensorDiscovery.helloMessage.length, discoveryPort, broadcastAddress);
    }

}