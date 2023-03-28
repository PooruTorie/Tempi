import {Component} from "react";
import {Button, Card, Metric, Table, TableBody, TableHead, TableHeaderCell, TableRow, TextInput} from "@tremor/react";
import {getNewSensorUUIDs, setSensorName} from "../api/NewSensor";

class AddNewSensor extends Component {

    constructor(props) {
        super(props);
        this.state = {name: props.name || "", error: null, loading: false, show: true};
    }

    render() {
        if (this.state.show) {
            return <TableRow>
                <TableHeaderCell className="align-middle">{this.props.uuid}</TableHeaderCell>
                <TableHeaderCell>
                    <TextInput error={this.state.error !== null} errorMessage={this.state.error}
                               value={this.state.name} placeholder="Name"
                               onChange={event => this.setState({name: event.target.value.trim()})}/>
                </TableHeaderCell>
                <TableHeaderCell>
                    <Button loading={this.state.loading}
                            onClick={() => {
                                if (this.state.name === "") {
                                    this.setState({error: "The name can not be blank."});
                                    return;
                                }
                                if (this.state.name.length > 20) {
                                    this.setState({error: "The name is to long max 20 chars."});
                                    return;
                                }
                                this.setState({loading: true});
                                setSensorName(this.props.uuid, this.state.name)
                                    .then(() => this.setState({show: false}));
                            }}>
                        Register
                    </Button>
                </TableHeaderCell>
            </TableRow>
        }
        return <></>;
    }
}

export default class NewSensorManager extends Component {

    constructor(props) {
        super(props);
        this.state = {sensors: []};
    }


    componentDidMount() {
        const getNewSensors = () => getNewSensorUUIDs().then(sensors => this.setState({sensors}));
        this.timer = setInterval(getNewSensors, 5000);
        getNewSensors();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        if (this.state.sensors.length > 0) {
            return <Card className="my-6 w-full" decoration="bottom" decorationColor="amber">
                <Metric>New Sensors Found</Metric>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>UUID</TableHeaderCell>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell></TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.sensors.map(uuid => <AddNewSensor uuid={uuid}/>)}
                    </TableBody>
                </Table>
            </Card>
        }
        return <></>;
    }
}