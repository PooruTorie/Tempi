import * as dgram from "dgram";
import {clearInterval} from "timers";
import {request} from "http";

export default class SensorDiscovery {

    static helloMessage: Buffer = new Buffer("HELLO");

    public static startDiscovery(brokerIp: string, discoveryPort: number, timeout: number = 5) {
        return new Promise((resolve) => {
            const socket = dgram.createSocket("udp4");

            console.log("Starting Discovery...")
            let helloInterval: NodeJS.Timer;

            socket.on("listening", function () {
                socket.setBroadcast(true);
                helloInterval = setInterval(() => {
                    console.log("Broadcasting Discovery Hello");
                    socket.send(SensorDiscovery.helloMessage, 0, SensorDiscovery.helloMessage.length, discoveryPort, "255.255.255.255");
                }, 1000);
            });

            socket.on("message", (message: string, remote: dgram.RemoteInfo) => {
                if (message === "DEVICE") {
                    console.log("Device Found:", remote.address + ":" + remote.port);
                    request("http://" + remote.address + "/broker?ip=" + brokerIp, (res) => {
                        console.log("Broker send Responded:", res.statusCode);
                    });
                }
            });

            socket.bind(discoveryPort);

            setTimeout(() => {
                clearInterval(helloInterval);
                socket.close(resolve.bind(this, true));
            }, (1 + timeout) * 1000);
        });
    }

}