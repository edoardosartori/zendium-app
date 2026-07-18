import { useEffect, useState } from "react";

import { timeline } from "./BootTimeLine";

import Logo from "../effects/Logo";
import Kernel from "../effects/Kernel";
import HexGrid from "../effects/HexGrid";
import Radar from "../effects/Radar";
import DashboardTransition from "../effects/DashboardTransition";

type Props = {
    onFinish: () => void;
};

export default function BootSequence({ onFinish }: Props) {

    const [step, setStep] = useState(0);

    useEffect(() => {

        if (step >= timeline.length - 1) {

            const timer = setTimeout(() => {

                onFinish();

            }, timeline[step].duration);

            return () => clearTimeout(timer);

        }

        const timer = setTimeout(() => {

            setStep((prev) => prev + 1);

        }, timeline[step].duration);

        return () => clearTimeout(timer);

    }, [step, onFinish]);

    const event = timeline[step];

    switch (event.type) {

        case "logo":
            return <Logo />;

        case "kernel":
            return <Kernel />;

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