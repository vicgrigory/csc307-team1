// Help.jsx

import "./Help.css";

export default function Help() {
  return (
    <div className="page-container help-page">
      <main className="page-content">
        <h1>Help &amp; Support</h1>
        <p>
          Welcome to the OpenShelf Help Center! Here you’ll find answers to common questions,
          troubleshooting tips, and resources to help you get the most out of the platform.
        </p>

        {/* Quick links */}
        <section className="help-toc">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#getting-started">Getting Started</a></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
            <li><a href="#troubleshooting">Troubleshooting</a></li>
            <li><a href="#contact-support">Contact Support</a></li>
          </ul>
        </section>

        <section id="getting-started">
          <h2>Getting Started</h2>
          <ul>
            <li>Create an account to upload, save, and favorite resources.</li>
            <li>Use the search bar to find textbooks, notes, slides, or videos.</li>
            <li>Upload materials through the <strong>Upload</strong> link in the navigation bar.</li>
          </ul>
        </section>

        <section id="faq">
          <h2>Frequently Asked Questions</h2>

          <h3>How do I upload a file?</h3>
          <p>
            Go to the Upload page, fill out the required fields, and attach your file. Supported file
            types include PDFs, images, and slide decks.
          </p>

          <h3>Why can't I see my uploaded item?</h3>
          <p>
            Uploads may take a few moments to process. Refresh the page or check your profile’s
            <strong> My Uploads</strong> section. If it still doesn’t appear after a few minutes,
            try re-uploading.
          </p>

          <h3>How do I edit or delete an upload?</h3>
          <p>
            Navigate to your Profile, open the item, and select the <strong>Edit</strong> or
            <strong> Delete</strong> option.
          </p>

          <h3>How do views work?</h3>
          <p>
            Every time a user opens your upload’s detail page, it counts as one view.
          </p>
        </section>

        <section id="troubleshooting">
          <h2>Troubleshooting</h2>

          <h3>I can’t log in</h3>
          <ul>
            <li>Double-check your email and password.</li>
            <li>Try resetting your password.</li>
            <li>Make sure your internet connection is stable.</li>
          </ul>

          <h3>Search isn’t working</h3>
          <p>
            If your search returns nothing, try fewer keywords, broader terms, or check spelling.
            If the problem persists, try refreshing the page or logging out and back in.
          </p>
        </section>

        <section id="contact-support">
          <h2>Contact Support</h2>
          <p>Email: support@openshelf.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Typical response time: 1–2 business days</p>
        </section>

        <p className="help-footer">
          <em>Thanks for using OpenShelf! We're here to support you.</em>
        </p>
      </main>
    </div>
  );
}