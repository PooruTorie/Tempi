import {Card, Metric, Text} from "@tremor/react";
import {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

export default class App extends Component {

    render() {
        return <Card className="max-w-xs mx-auto">
            <Text>Sales <FontAwesomeIcon icon={solid("microchip")} beat/></Text>
            <Metric>$ 34,743</Metric>
        </Card>;
    }

}