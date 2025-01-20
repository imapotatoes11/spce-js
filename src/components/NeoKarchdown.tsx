'use client'

import { TextAnimate } from "./ui/text-animate";
import { motion } from "framer-motion";

interface KarchdownProps {
    className: string;
    raw: string;
    loading: boolean;
}
const randInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function mapMotion(line: string) {
    return line.split(' ').map((word, indexx) => {
        return <motion.div
            key={indexx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                // type: "spring",
                // stiffness: 260,
                // damping: 20
                type: "easeOut",
                ease: "easeOut",
                duration: 0.4,

                // type: "spring",
                // stiffness: 1000,
                // damping: 5
            }}
            className="inline-block ml-1"
        // className={"block whitespace-pre"}
        >{word}</motion.div>
    })
}
export default function NeoKarchdown({ className = '', raw = '', loading = false }: KarchdownProps) {
    // let split = raw.split(' ');
    let split = raw.split('<br>');
    let output = split.map((line, index) => {
        // format bold, italics, underline
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold">$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em className="italic">$1</em>');
        line = line.replace(/__(.*?)__/g, '<u className="underline">$1</u>');

        if (line === "") line = ' ';

        if (line.startsWith('# ')) {
            line = line.replace(/^#+ /, '');
            // return <h1 key={index} className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: line }} />;
            return <h1 key={index} className="text-2xl font-bold">
                {mapMotion(line)}
            </h1>;
        } if (line.startsWith('## ')) {
            line = line.replace(/^#+ /, '');
            // return <h2 key={index} className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: line }} />;
            return <h2 key={index} className="text-xl font-bold">
                {mapMotion(line)}
            </h2>;
        } if (line.startsWith('### ')) {
            line = line.replace(/^#+ /, '');
            // return <h3 key={index} className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: line }} />;
            return <h3 key={index} className="text-lg font-bold">
                {mapMotion(line)}
            </h3>;
        } if (line.startsWith('#### ')) {
            line = line.replace(/^#+ /, '');
            // return <h4 key={index} className="text-md font-bold" dangerouslySetInnerHTML={{ __html: line }} />;
            return <h4 key={index} className="text-md font-bold">
                {mapMotion(line)}
            </h4>;
        }

        if (line.startsWith('- ')) {
            line = line.replace(/^- /, '');
            return <div className="h-min flex justify-start gap-3 align-middle" key={index}>
                <span className="h-1.5 w-1.5 my-auto bg-black dark:bg-white rounded-full"></span>
                {/* <li key={index} dangerouslySetInnerHTML={{ __html: line }} /> */}
                <li key={index}>
                    {mapMotion(line)}
                </li>
            </div>
        }
        // return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
        return <p key={index}>
            {mapMotion(line)}
        </p>;
    });

    return (
        // <div className={className}>
        //     <ul>{output}</ul>
        // </div>
        <div className={className}>
            {/* <TextAnimate animation="slideLeft" by="word">
                {raw}
            </TextAnimate> */}
            {output}
            {(loading && raw.length < 5) && <motion.div
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                initial={{ scale: 0.75 }}
                animate={{ scale: 1 }}
                transition={{
                    // type: "spring",
                    // stiffness: 400,
                    // damping: 40,
                    type: "easeInOut",
                    ease: "easeInOut",
                    duration: 0.75,
                    repeat: Infinity,
                    repeatType: "mirror",
                    repeatDelay: 0.05,
                }}
                className="w-fit"
            ><span className="w-4 h-4 m-2 bg-black dark:bg-white rounded-full block"></span></motion.div>}
        </div>
    );
}