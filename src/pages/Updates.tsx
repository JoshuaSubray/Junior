interface UpdateSection {
  title: string
  date: string
  changes: string[]
}

const updateSections: UpdateSection[] = [
  {
    title: 'v1.0 - Initial Release',
    date: 'Sep. 12, 2026',
    changes: [
      'Project JR has been officially released to the public!',
    ],
  },
]

export default function Updates() {
  return (
    <>
      <h2 className="section-title">Updates</h2>
      <div className="section-content updates-list">
        {updateSections.map((section) => (
          <article className="patch-note" key={`${section.date}-${section.title}`}>
            <div className="patch-note-header">
              <h3 className="page-sub-heading">{section.title}</h3>
              <time className="patch-note-date">{section.date}</time>
            </div>
            <ul className="patch-note-changes">
              {section.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  )
}