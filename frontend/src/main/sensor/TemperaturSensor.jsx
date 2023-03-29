import {Component} from "react";
import {BadgeDelta, CategoryBar, Flex, Metric, Text} from "@tremor/react";

export default class TemperaturSensor extends Component {

    render() {
        return <>
            <Flex>
                <Text className="truncate">Overall Performance Score</Text>
                <BadgeDelta deltaType="moderateIncrease">13.1%</BadgeDelta>
            </Flex>
            <Flex
                justifyContent="start"
                alignItems="baseline"
                className="space-x-1"
            >
                <Metric>65</Metric>
                <Text>/100</Text>
            </Flex>
            <CategoryBar
                categoryPercentageValues={[10, 25, 45, 20]}
                colors={["emerald", "yellow", "orange", "red"]}
                percentageValue={65}
                tooltip="65%"
                className="mt-2"
            />
        </>
    }

}