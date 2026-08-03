import './About.css'

export default function About() {
  return (
    <>
      <h2 className="section-title">About</h2>
      <div className="section-content">
        <p className="about-intro">
          <strong>Junior</strong> is an intuitive, web-based GPA planning and grade tracking application made by students, for students.
        </p>

        <h3 className="about-sub-heading">How To Use</h3>
        <p>TBA.</p>

        <h3 className="about-sub-heading">Source Code</h3>
        <p>
          Our code is completely source-available on GitHub, however protected under the <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-ND 4.0</a> license. Please contact us if you wish to use our code for any reason.
        </p>

        <h3 className="about-sub-heading">Donate</h3>
        <p>
          Want to help keep Junior free, accessible, and source-available? Consider donating to support the developers and their future endeavors! Every contribution is greatly appreciated.
        </p>
      </div>
    </>
  )
}
