import {Component} from "react";
import {Card} from "@tremor/react";
import TemperaturSensor from "./TemperaturSensor";

export default class SensorCard extends Component {
    render() {
        return <Card className="max-w-lg mx-auto">
            {
                (() => {
                    switch (this.props.sensor.type) {
                        case "temperature":
                            return <TemperaturSensor sensor={this.props.sensor}/>
                        default:
                            return <></>
                    }
                })()
            }
        </Card>
    }
}