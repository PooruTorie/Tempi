import {Component} from "react";
import {Button, Card, Col} from "@tremor/react";
import TemperaturSensor from "./TemperaturSensor";
import {getSensorData} from "../../api/Sensor";
import {CogIcon} from "@heroicons/react/solid";

export default class SensorCard extends Component {

    constructor(props) {
        super(props);
        this.state = {data: {}};
    }


    componentDidMount() {
        getSensorData(this.props.sensor.uuid).then(data => this.setState({data}));
        this.eventSource = new EventSource("/api/realtime");
        this.eventSource.addEventListener(this.props.sensor.uuid,
            e => this.setState({data: JSON.parse(e.data)})
        );
    }

    componentWillUnmount() {
        this.eventSource.close();
    }

    render() {
        return <Col>
            <Card className="max-w-lg">
                {(() => {
                    switch (this.props.sensor.type) {
                        case "temperature":
                            return <TemperaturSensor sensor={this.props.sensor} data={this.state.data}>
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