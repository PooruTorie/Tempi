import {Component} from "react";
import {Button, Flex} from "@tremor/react";
import {XIcon} from "@heroicons/react/solid";
import TemperatureOverview from "./TemperatureOverview";
import SensorSettings from "./SensorSettings";

export default class OverviewContentPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {chartData: []};
    }

    render() {
        return <>
            <Flex className="m-2" justifyContent="end">
                <Button icon={XIcon} color={"red"} onClick={() => {
                    this.props.onClose();
                }}>Close</Button>
            </Flex>
            {(() => {
                switch (this.props.sensor.type) {
                    case "temperature":
                        return <TemperatureOverview sensor={this.props.sensor}/>
                    default:
                        return <SensorSettings sensor={this.props.sensor}/>
                }
            })()}
        </>;
    }
}