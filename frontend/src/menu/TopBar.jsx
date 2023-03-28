import {Component} from "react";
import {Card, Col, Grid, TextInput} from "@tremor/react";
import {SearchIcon} from "@heroicons/react/solid";
import {ReactComponent as Logo} from "../assets/logo.svg";

export default class TopBar extends Component {

    render() {
        return <Card className="h-[9%]">
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
    }

}