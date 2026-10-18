import { motion, useTransform } from 'framer-motion';

function Character({ char, index, total, progress, highlighted }) {
    const start = 0.54 + (index / Math.max(total, 1)) * 0.4;
    const end = Math.min(start + 0.08, 1);

    const opacity = useTransform(progress, [start, end], [0, 1], {
        clamp: true,
    });

    const y = useTransform(progress, [start, end], [12, 0], {
        clamp: true,
    });

    return (
        <motion.span
            aria-hidden="true"
            className={highlighted ? 'about__name-highlight' : undefined}
            style={{ opacity, y, display: 'inline-block' }}
        >
            {char === ' ' ? '\u00a0' : char}
        </motion.span>
    );
}

function CharacterReveal({ text, progress, highlight = '', className = '' }) {
    const chars = Array.from(text);
    const highlightStart = highlight ? text.indexOf(highlight) : -1;

    return (
        <span className={className} aria-label={text}>
            {chars.map((char, index) => (
                <Character
                    key={index}
                    char={char}
                    index={index}
                    total={chars.length}
                    progress={progress}
                    highlighted={
                        highlightStart !== -1 &&
                        index >= highlightStart &&
                        index < highlightStart + highlight.length
                    }
                />
            ))}
        </span>
    );
}

export default CharacterReveal;
