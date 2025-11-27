export default function Help() {
  return (
    <div className="page-container help-page">
      <main className="page-content">
        <h1>Help & Support</h1>
        <p>
          Welcome to the OpenShelf Help Center! Here you’ll find answers to common questions,
          troubleshooting steps, and resources to help you get the most out of the platform.
        </p>

        <section>
          <h2>Getting Started</h2>
          <ul>
            <li>Create an account to upload or save resources.</li>
            <li>Use the search bar to find textbooks, notes, slides, or videos.</li>
            <li>Upload materials through the "Upload" link in the navigation bar.</li>
          </ul>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>

          <h3>How do I upload a file?</h3>
          <p>
            Go to the Upload page, fill out the required fields, and attach your file. Supported file
            types include PDF, images, and slides.
          </p>

          <h3>Why can't I see my uploaded item?</h3>
          <p>
            Uploads may take a few moments to process. Refresh the page or check your profile’s
            "My Uploads" section. If it still doesn’t appear, try re-uploading.
          </p>

          <h3>How do I edit or delete an upload?</h3>
          <p>
            Navigate to your Profile, open the item, and select the Edit or Delete option.
          </p>

          <h3>How do views work?</h3>
          <p>
            Every time a user opens your upload’s detail page, it counts as one view.
          </p>
        </section>

        <section>
          <h2>Troubleshooting</h2>

          <h3>I can’t log in</h3>
          <ul>
            <li>Double-check your email and password.</li>
            <li>Try resetting your password.</li>
            <li>Make sure your internet connection is stable.</li>
          </ul>

          <h3>Search isn’t working</h3>
          <p>
            If your search returns nothing, try fewer keywords or check spelling.
          </p>
        </section>

        <section>
          <h2>Contact Support</h2>
          <p>Email: support@openshelf.com</p>
	  <p>Phone: (248) 434-5508</p>
          <p>Response time: 1–2 business days</p>
        </section>

        <p className="help-footer">
          <em>Thanks for using OpenShelf! We're here to support you.</em>
        </p>
      </main>
    </div>
  );
}

