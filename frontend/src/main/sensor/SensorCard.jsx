import {Component} from "react";
import {Button, Card, Col} from "@tremor/react";
import TemperaturSensor from "./TemperaturSensor";
import {CogIcon} from "@heroicons/react/solid";

export default class SensorCard extends Component {
    render() {
        return <Col>
            <Card className="max-w-lg">
                {(() => {
                    switch (this.props.sensor.type) {
                        case "temperature":
                            return <TemperaturSensor sensor={this.props.sensor}>
                                <Button icon={CogIcon} onClick={() => {
                                    console.log(this.props.sensor);
                                }}>Settings</Button>
                            </TemperaturSensor>
                        default:
                            return <></>
                    }
                })()}
            </Card>
        </Col>
    }
}