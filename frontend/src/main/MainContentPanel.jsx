import {Component} from "react";
import {AreaChart, Card, Col, Grid, Metric, Tab, TabList, Text, Title} from "@tremor/react";
import NewSensorManager from "./NewSensorManager";
import SensorCard from "./sensor/SensorCard";

export default class MainContentPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {selectedView: "1"};
    }


    render() {
        return <Col numColSpan={5} className="h-[101%] overflow-auto">
            <div className="w-full border-none h-max p-4 border-x border-gray-200">
                <NewSensorManager/>
                <Metric>Dashboard</Metric>
                <Text>Sales and growth stats for anonymous inc.</Text>
                <TabList defaultValue={this.state.selectedView}
                         onValueChange={(selectedView) => this.setState({selectedView})}
                         marginTop="mt-6">
                    <Tab value="1" text="Page 1"/>
                    <Tab value="2" text="Page 2"/>
                </TabList>

                <SensorCard sensor={{type: "temperature"}}/>

                {this.state.selectedView === "1" ? (
                    <>
                        {/* Main section */}
                        <Card className="mt-6">
                            <Title>Share Price</Title>
                            <Text>Daily share price of a fictive company</Text>
                            <AreaChart
                                className="mt-8 h-44"
                                data={[{test: 1}]}
                                categories={["Gross Volume"]}
                                index="test"
                                colors={["indigo"]}
                                valueFormatter={this.valueFormatter}
                                showYAxis={false}
                                showLegend={false}
                            />
                        </Card>

                        {/* KPI section */}
                        <Grid numColsMd={2} className="mt-6 gap-6">
                            <Card>
                                {/* Placeholder to set height */}
                                <div className="h-28"/>
                            </Card>
                            <Card>
                                {/* Placeholder to set height */}
                                <div className="h-28"/>
                            </Card>
                        </Grid>
                    </>
                ) : (
                    <Grid numColsMd={2} className="mt-6 gap-6">
                        <Card>
                            <div className="h-44"/>
                        </Card>
                        <Card>
                            <div className="h-44"/>
                        </Card>
                        <Card>
                            <div className="h-44"/>
                        </Card>
                        <Card>
                            <div className="h-44"/>
                        </Card>
                        <Card>
                            <div className="h-44"/>
                        </Card>
                        <Card>
                            <div className="h-44"/>
                        </Card>
                    </Grid>
                )}
            </div>
        </Col>
    }
}