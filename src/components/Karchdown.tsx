'use client'

interface KarchdownProps {
    className: string;
    raw: string;
}
export default function Karchdown({ className = '', raw = '' }: KarchdownProps) {
    let split = raw.split('<br>');
    let output = split.map((line, index) => {
        // format bold, italics, underline
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold">$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em className="italic">$1</em>');
        line = line.replace(/__(.*?)__/g, '<u className="underline">$1</u>');

        if (line === "") line = ' ';

        if (line.startsWith('# ')) {
            line = line.replace(/^#+ /, '');
            return <h1 key={index} className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: line }} />;
        } if (line.startsWith('## ')) {
            line = line.replace(/^#+ /, '');
            return <h2 key={index} className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: line }} />;
        } if (line.startsWith('### ')) {
            line = line.replace(/^#+ /, '');
            return <h3 key={index} className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: line }} />;
        } if (line.startsWith('#### ')) {
            line = line.replace(/^#+ /, '');
            return <h4 key={index} className="text-md font-bold" dangerouslySetInnerHTML={{ __html: line }} />;
        }

        if (line.startsWith('- ')) {
            line = line.replace(/^- /, '');
            return <div className="h-min flex justify-start gap-3 align-middle" key={index}>
                <span className="h-1.5 w-1.5 my-auto bg-black dark:bg-white rounded-full"></span>
                <li key={index} dangerouslySetInnerHTML={{ __html: line }} />
            </div>
        }
        return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
    });

    return (
        <div className={className}>
            <ul>{output}</ul>
        </div>
    );
}