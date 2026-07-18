import Intro from "./Intro";
import BootSequence from "./BootSequence";
import "./Boot.css";

export default function Boot(){

    return(

        <div className="boot">

            <Intro/>

            <BootSequence/>

        </div>

    );

}