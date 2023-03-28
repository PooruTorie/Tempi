import {Grid, Text} from "@tremor/react";
import {Component} from "react";
import TopBar from "./menu/TopBar";
import MainContentPanel from "./main/MainContentPanel";
import SideMenu from "./menu/SideMenu";

export default class App extends Component {

    render() {
        return <>
            <TopBar/>
            <Grid numCols={6} className="h-[86%]">
                <SideMenu/>
                <MainContentPanel/>
            </Grid>
            <footer className="mt-5 m-auto h-[3%]">
                <Text className="text-center">Tempi 2023</Text>
            </footer>
        </>
    }

}