import { useEffect, useState } from "react";

import { timeline } from "./BootTimeLine";

import Logo from "../views/Logo";
import HexGrid from "../views/HexGrid";
import Radar from "../views/Radar";
import DashboardTransition from "../views/DashboardTransition";

import TerminalBoot from "./TerminalBoot";

type Props = {
    onFinish: () => void;
};

export default function BootSequence({ onFinish }: Props) {

    const [step, setStep] = useState(0);

    const event = timeline[step];

    useEffect(() => {

        // Ultimo evento → termina la boot
        if (step >= timeline.length - 1) {

            const timer = setTimeout(() => {

                onFinish();

            }, event.duration ?? 0);

            return () => clearTimeout(timer);

        }

        // Gli eventi "terminal" avanzano da soli
        if (event.type === "terminal")
            return;

        const timer = setTimeout(() => {

            setStep(prev => prev + 1);

        }, event.duration ?? 0);

        return () => clearTimeout(timer);

    }, [step, event, onFinish]);

    switch (event.type) {

        case "logo":
            return <Logo />;

        case "terminal":

            return (

                <TerminalBoot

                    lines={event.lines}

                    onComplete={() => {

                        setStep(prev => prev + 1);

                    }}

                />

            );

        case "hex":
            return <HexGrid />;

        case "radar":
            return <Radar />;

        case "dashboard":
            return <DashboardTransition />;

        default:
            return null;

    }

}