import * as ip from "ip";

export class AddressExtractor {
    public static address: string | undefined;
    public static broadcast: string;

    static extract() {
        this.address = process.env.IP_ADDRESS;
        let netmask = process.env.NETMASK;

        if (!this.address) {
            console.error("No ip address in envs");
            return false;
        }

        if (!netmask) {
            console.error("No netmask in envs");
            return false;
        }

        this.broadcast = ip.subnet(this.address, netmask).broadcastAddress;

        console.log("Address Extractor made", this.address, this.broadcast);

        return true;
    }

}