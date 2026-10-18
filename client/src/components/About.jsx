import ScrollExpand from './ScrollExpand'
import CharacterReveal from './CharacterReveal'
import './About.css'

function About({ onExpansionChange }) {
    return (
        <section id="about" className="about">
            <div className="about__visual">
                <ScrollExpand
                    onExpansionChange={onExpansionChange}
                    src="/images/about-portrait.jpg"
                    alt="Portrait at the Taj Mahal"
                    scrollHint="Scroll"
                    sectionLabel={
                        <div className="about__header">
                            <span className="about__eyebrow">01 / ABOUT ME</span>
                            <span className="about__line" />
                        </div>
                    }
                    useWindowScroll
                    startWidth={38}
                    startHeight={42}
                    mediaZoom={1.15}
                    scrollDistance={1.4}
                    holdDistance={0.25}
                >
                    {(progress) => (
                        <div className="about__content">
                            <h2 className="about__statement">
                                <CharacterReveal
                                    progress={progress}
                                    text="I'M PARIKSHIT, A BTECH STUDENT AT JK LAKSHMIPAT UNIVERSITY. I'VE ALWAYS BEEN CURIOUS ABOUT HOW THINGS WORK BEHIND THE SCENES, WHICH IS WHY I'M DRAWN TO CYBERSECURITY AND REVERSE ENGINEERING. I LOVE TAKING THINGS APART, EXPLORING THEIR INNER WORKINGS, AND UNDERSTANDING THE FUNDAMENTALS THAT MAKE COMPLEX SYSTEMS TICK. I ALSO ENJOY BUILDING PROJECTS THAT SOLVE REAL-WORLD PROBLEMS OR TEACH ME SOMETHING NEW ABOUT HOW TECHNOLOGY WORKS UNDER THE HOOD."
                                    highlight="PARIKSHIT"
                                />
                            </h2>
                        </div>
                    )}
                </ScrollExpand>
            </div>
        </section>
    )
}

export default About