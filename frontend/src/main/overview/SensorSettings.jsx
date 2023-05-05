import {Component} from "react";
import {Card, Text, TextInput, Title} from "@tremor/react";
import {setSensorName} from "../../api/Sensor";

export default class SensorSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {nameReady: true};
    }


    render() {
        return <Card>
            <Title>Settings</Title>

            <Text>Name:</Text>
            <TextInput error={!this.state.nameReady} value={this.props.sensor.name} onChange={e => {
                this.setState({nameReady: false})
                setSensorName(this.props.sensor.uuid, this.props.sensor.name).then(() => {
                    this.setState({nameReady: true})
                });
            }}/>
        </Card>
    }

}