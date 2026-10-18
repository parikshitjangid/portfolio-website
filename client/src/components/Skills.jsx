
import DepthCarousel from './DepthCarousel'
import './Skills.css'

const skillGroups = [
  {
    title: 'Frontend',
    description:
      'Building user interfaces and the experiences people interact with.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    title: 'Backend',
    description:
      'Working with server-side logic, APIs, and data persistence.',
    technologies: ['Node.js', 'Express', 'MongoDB'],
  },
  {
    title: 'Tools & Technologies',
    description:
      'Exploring development tools, programming, and operating systems.',
    technologies: ['Git', 'GitHub', 'Python', 'Linux'],
  },
]

function Skills() {
  return (
    <section className="skills-section" id="skills">
      <div className="skills-section__container">
        <header className="skills-section__heading">
          <p className="skills-section__eyebrow">02 / WHAT I WORK WITH</p>
        </header>

        <DepthCarousel items={skillGroups} />
      </div>
    </section>
  )
}

export default Skills
