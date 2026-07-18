import { useEffect, useState } from "react";
import { timeline } from "./BootTimeLine";

export default function BootSequence() {

    const [step, setStep] = useState(0);

    useEffect(() => {

        if (step >= timeline.length - 1)
            return;

        const timer = setTimeout(() => {
            setStep(step + 1);
        }, timeline[step].duration);

        return () => clearTimeout(timer);

    }, [step]);

    const event = timeline[step];

    return (

        <div className="boot-sequence">

            <pre>
                {JSON.stringify(event, null, 2)}
            </pre>

        </div>

    );

}