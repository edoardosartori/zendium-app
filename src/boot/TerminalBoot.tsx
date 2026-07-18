import { useEffect, useState } from "react";

import TypingText from "../core/utils/TypingText";

type Props = {
    lines: string[];
    onComplete?: () => void;
};

export default function TerminalBoot({
    lines,
    onComplete
}: Props) {
    const [currentLine, setCurrentLine] = useState(0);
    useEffect(() => {
        if (currentLine >= lines.length) {
            onComplete?.();
        }

    }, [currentLine, lines.length, onComplete]);

    if (currentLine >= lines.length)
        return null;

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: "#000",
                color: "#55ff55",
                fontFamily: "monospace",
                fontSize: "22px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <div
                style={{
                    width: "900px"
                }}
            >
                {
                    lines.slice(0, currentLine).map((line, index) => (
                        <div key={index}>
                            {line}
                        </div>
                    ))
                }

                <TypingText
                    key={currentLine}
                    text={lines[currentLine]}
                    onComplete={() => {
                        setTimeout(() => {
                            setCurrentLine(prev => prev + 1);
                        }, 250);
                    }}
                />
            </div>
        </div>
    );
}
