ADHD Ease — PWA-ready package

Included: the complete existing app, Supabase client, manifest, service worker, icons, and mobile wrapper files.

Changes made:
- Kept the existing app interface and task/planner functions.
- Kept one green Install ADHD Ease button in the homepage hero.
- The button opens the browser's native install prompt when the browser provides beforeinstallprompt.
- Fixed manifest, icon, and service-worker paths to be relative to the project folder. This supports GitHub Pages at /adhd-ease/ as well as a root-domain deployment.
- Updated the service worker cache version and made its cache paths follow its registered scope.
- Removed the old secondary home link and manual browser-menu instructions from install.html.

Important: Chrome controls when the native install prompt is available. A webpage cannot force Chrome to display it. The green button will open the prompt as soon as Chrome marks the PWA installable and dispatches beforeinstallprompt.

GitHub Pages: upload the CONTENTS of this ZIP to the repository root, preserving the icons folder. In Settings > Pages, publish branch main from /(root).
