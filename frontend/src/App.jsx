import {AreaChart, Card, Col, Grid, Metric, Tab, TabList, Text, TextInput, Title} from "@tremor/react";
import {SearchIcon} from "@heroicons/react/solid";
import Logo from "./assets/logo";
import {Component} from "react";

const data = [
    {
        Month: "Jan 21",
        "Gross Volume": 2890,
        "Successful Payments": 2400,
        Customers: 4938
    },
    {
        Month: "Feb 21",
        "Gross Volume": 1890,
        "Successful Payments": 1398,
        Customers: 2938
    },
    {
        Month: "Mar 21",
        "Gross Volume": 2190,
        "Successful Payments": 1900,
        Customers: 1638
    },
    {
        Month: "Apr 21",
        "Gross Volume": 3470,
        "Successful Payments": 3908,
        Customers: 2138
    },
    {
        Month: "May 21",
        "Gross Volume": 2170,
        "Successful Payments": 4800,
        Customers: 2142
    },
    {
        Month: "Jun 21",
        "Gross Volume": 3170,
        "Successful Payments": 3800,
        Customers: 5120
    },
    {
        Month: "Jul 21",
        "Gross Volume": 3490,
        "Successful Payments": 4300,
        Customers: 3890
    },
    {
        Month: "Aug 21",
        "Gross Volume": 2190,
        "Successful Payments": 4100,
        Customers: 3165
    },
    {
        Month: "Sep 21",
        "Gross Volume": 3344,
        "Successful Payments": 4934,
        Customers: 1945
    },
    {
        Month: "Oct 21",
        "Gross Volume": 1564,
        "Successful Payments": 1245,
        Customers: 2345
    },
    {
        Month: "Nov 21",
        "Gross Volume": 3345,
        "Successful Payments": 2654,
        Customers: 4845
    },
    {
        Month: "Dec 21",
        "Gross Volume": 2740,
        "Successful Payments": 3421,
        Customers: 2945
    },
    {
        Month: "Jan 22",
        "Gross Volume": 3890,
        "Successful Payments": 2980,
        Customers: 2645
    }
];

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedView: "1"};
    }

    valueFormatter(number) {
        return `$ ${Intl.NumberFormat("us").format(number).toString()}`;
    }

    render() {
        return <>
            <Card className="h-[9%]">
                <Grid numCols={10}>
                    <Col numColSpan={1}>
                        <div className="w-full -ml-2 -mt-8">
                            <Logo/>
                        </div>
                    </Col>
                    <Col numColSpan={9}>
                        <TextInput icon={SearchIcon} placeholder="Search..."/>
                    </Col>
                </Grid>
            </Card>
            <Grid numCols={6} className="h-[82%]">
                <Col className="h-full">
                    <Card className="mt-6 h-full">
                        <TabList defaultValue={"test1"} className="flex-col border-0">
                            <Tab value={"test1"} text={"Test"} className="!ml-0"/>
                            <Tab value={"test2"} text={"Test"} className="!ml-0"/>
                        </TabList>
                    </Card>
                </Col>
                <Col numColSpan={5} className="overflow-auto">
                    <div className="w-full border-none h-full p-4 border-x border-gray-200">
                        <Metric>Dashboard</Metric>
                        <Text>Sales and growth stats for anonymous inc.</Text>
                        <TabList defaultValue="1" onValueChange={(selectedView) => this.setState({selectedView})}
                                 marginTop="mt-6">
                            <Tab value="1" text="Page 1"/>
                            <Tab value="2" text="Page 2"/>
                        </TabList>

                        {this.state.selectedView === "1" ? (
                            <>
                                {/* Main section */}
                                <Card className="mt-6">
                                    <Title>Share Price</Title>
                                    <Text>Daily share price of a fictive company</Text>
                                    <AreaChart
                                        className="mt-8 h-44"
                                        data={data}
                                        categories={["Gross Volume"]}
                                        index="Month"
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
            </Grid>
            <footer className="mt-14 m-auto h-[3%]">
                <Text className="text-center">Tempi 2023</Text>
            </footer>
        </>;
    }

}