import {Component} from "react";
import {Col, Grid, Metric, Text} from "@tremor/react";
import NewSensorManager from "./NewSensorManager";
import SensorCard from "./sensor/SensorCard";
import {getSensors} from "../api/Sensor";

export default class MainContentPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {sensors: []};
    }

    componentDidMount() {
        getSensors().then(sensors => this.setState({sensors}));
    }

    render() {
        return <Col numColSpan={5} className="h-[101%] overflow-auto">
            <div className="w-full border-none h-max p-4 border-x border-gray-200">
                <NewSensorManager/>
                <Metric>Dashboard</Metric>
                <Text>Sales and growth stats for anonymous inc.</Text>

                <Grid className="mt-6" numCols={this.state.sensors.length}>
                    {this.state.sensors.map(sensor => <SensorCard sensor={sensor}/>)}
                </Grid>
            </div>
        </Col>
    }
}