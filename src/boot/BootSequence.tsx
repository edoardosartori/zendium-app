import { useEffect, useState } from "react";
import { timeline } from "./BootTimeLine";

export default function BootSequence() {

    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {

        let cancelled = false;

        async function playBoot() {

            for (const block of timeline) {

                if (cancelled) return;

                setLines(prev => [
                    ...prev,
                    ...block.lines
                ]);

                await new Promise(resolve =>
                    setTimeout(resolve, block.duration)
                );
            }
        }

        playBoot();

        return () => {
            cancelled = true;
        };

    }, []);

    return (
        <div className="boot-sequence">

            {lines.map((line, index) => (

                <div
                    key={index}
                    className="boot-line"
                >
                    {line}
                </div>

            ))}

        </div>
    );
}