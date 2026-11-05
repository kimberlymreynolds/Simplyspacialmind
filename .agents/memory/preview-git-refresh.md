---
name: Preview after Git refresh
description: A repository refresh can leave the running Preview server using an earlier source root.
---

After Git operations or platform file refreshes, verify the actual HTML served by Preview rather than assuming a Vite automatic restart loaded the current configuration.

**Why:** A refresh temporarily removed the configuration while Vite restarted. Although its logs later reported a successful restart, it served the old React app even though the saved configuration selected the Night Garden homepage. A clean managed-workflow restart restored the correct page.

**How to apply:** If Preview changes or disappears immediately after Git work, inspect logs and the returned page title/entry point. When the running server disagrees with the saved configuration, restart the existing managed web workflow once and verify the page visually. Do not change or republish the live website to repair Preview.
