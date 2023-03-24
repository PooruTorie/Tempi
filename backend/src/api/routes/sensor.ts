import {Router} from "express";
import TempiAPI from "../tempi_api";

export default class SensorRouter {
    static route: string = "/sensor";
    private readonly router: Router;

    constructor(api: TempiAPI) {
        this.router = Router();

        this.router.get("/", (req, res) => {
            res.json({test: 1});
        });
    }

    get() {
        return this.router;
    }
}