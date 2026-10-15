# R. Sriram — Student Portfolio

A responsive personal portfolio built with plain HTML, CSS, and JavaScript. A lightweight canvas constellation fills the viewport behind the entire page and reacts to mouse movement as you scroll. It has no package installation or build step.

## Run it

1. Open this folder in File Explorer.
2. Double-click `index.html` to open the site in your browser.

For local development, you can also open the folder in VS Code and use the Live Server extension. The page works without a backend.

## Personalize it

The page currently uses the details provided so far: R. Sriram, fourth-year Computer Science & Engineering student, Solamalai College of Engineering. When you have your project, skill, and contact details, add them in the `profile` object at the top of `app.js`:

```js
const profile = {
  skills: ["JavaScript", "Python"],
  projects: [
    { name: "Project name", description: "What it does and what you contributed.", tags: ["HTML", "JavaScript"] },
  ],
  email: "you@example.com",
};
```

Replace the sample values above with your real details before publishing. Your name, college, and year are in `index.html`.

## Publish

This is a static site, so you can publish the folder using GitHub Pages, Netlify, or another static website host. No secrets or private keys belong in the site files.
