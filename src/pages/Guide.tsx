export default function Guide() {
  return (
    <>
      <h2 className="section-title">Guide</h2>
      <div className="section-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <p className="page-intro">
          This guide will walk you through everything you need to know to use Junior: Grade Calculator to easily calculate your grades and keep track of your academic progress.
        </p>

        <div>
          <h3 className="page-sub-heading">1. Managing Semesters</h3>
          <p>The app organizes your academic progress into <strong>Semesters</strong> (e.g., "Fall 2024", "Spring 2025").</p>
          <ul>
            <li><strong>Making a New Semester:</strong> Look at the <strong>Sidebar</strong> on the left side of the screen. Click the <strong>+ Add Semester</strong> button at the bottom of the list. A new semester will be created and automatically selected.</li>
            <li><strong>Renaming a Semester:</strong> Select a semester from the Sidebar. Look at the large banner at the top of the main page. <strong>Click directly on the title</strong> in the banner and type your desired name. Your changes are saved automatically!</li>
            <li><strong>Switching:</strong> Click on any semester name in the Sidebar to view its classes.</li>
            <li><strong>Deleting:</strong> Hover over a semester in the Sidebar and click the trash can icon next to it. <em>Warning: Deleting a semester removes all the classes and grades inside of it.</em></li>
          </ul>
        </div>

        <div>
          <h3 className="page-sub-heading">2. Managing Classes</h3>
          <p>Inside each semester, you can track individual <strong>Classes</strong> (e.g., "MATH 101").</p>
          <ul>
            <li><strong>Adding a Class:</strong> Ensure you have a semester selected. On the main page, click the <strong>+ Add Class</strong> button at the bottom of your class list.</li>
            <li><strong>Renaming a Class:</strong> Just like semesters, you can <strong>click directly on the class title</strong> in the list to rename it instantly.</li>
            <li><strong>Viewing Class Details:</strong> Click anywhere on the class row to open the <strong>Class Modal</strong> (a popup window). This is where you will add your actual grades!</li>
          </ul>
        </div>

        <div>
          <h3 className="page-sub-heading">3. Entering Your Grades</h3>
          <p>Once you've opened a Class, you can start tracking your grades using Categories and Items.</p>
          <ul>
            <li><strong>Categories:</strong> Categories group similar assignments together (e.g., "Midterms", "Homework"). Click <strong>+ Add Category</strong> to create a new group. Rename it by clicking its title. Set the percentage this category is worth towards your final class grade in the weight box (e.g., 30%).</li>
            <li><strong>Items (Assignments & Tests):</strong> Inside each category, click <strong>+ Add Item</strong>. Rename the item, enter the percentage you scored (e.g., 85%), and optionally add any bonus marks in the "+ Extra" box.</li>
          </ul>
        </div>

        <div>
          <h3 className="page-sub-heading">4. Settings & Data</h3>
          <p>Because Junior runs directly in your browser, your data is saved locally on your device. You can manage this data using the <strong>Settings Menu</strong>, accessed via the gear icon in the bottom footer.</p>
          <ul>
            <li><strong>Download Save:</strong> Exports all of your semesters, classes, and grades into a single <code>.json</code> file. This is great for backing up your data or moving it to another computer!</li>
            <li><strong>Load Save:</strong> Imports a previously downloaded <code>.json</code> save file.</li>
            <li><strong>Delete Save:</strong> Wipes all of your local data completely, giving you a fresh start. <em>Caution: This will permanently erase all data unless you have previously downloaded a backup!</em></li>
          </ul>
        </div>
      </div>
    </>
  )
}
