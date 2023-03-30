import {Router} from "express";
import TempiAPI from "../tempi_api";
import {EventEmitter} from "events";

export default class RealtimeRouter {
    static events = new EventEmitter();
    static route: string = "/realtime";
    private readonly router: Router;

    constructor(api: TempiAPI) {
        this.router = Router();

        this.router.get("/", async (req, res) => {
            res.writeHead(200, {
                Connection: "keep-alive",
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
            });
            res.write("init\n\n");
            RealtimeRouter.events.on("send", (label, data) => {
                res.write("event:" + label + "\ndata:" + data + "\n\n");
            });
        });
    }

    get() {
        return this.router;
    }
}