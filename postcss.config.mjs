/* SF Pro Display and SF Pro Text - Apple's standard fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  /* Primary font stack - SF Pro preferred, Apple system fonts */
  --font-sans: "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", "Monaco", "Menlo", "Consolas", "Courier New", monospace;
}

/* Load SF Pro fonts if available (fallback to system fonts) */
@supports (font-family: "SF Pro Display") {
  body {
    font-family: "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
  }
}

body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "liga", "kern";
}

/* Font weight utilities matching Apple's design system */
.font-light {
  font-weight: 300;
}

.font-normal {
  font-weight: 400;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.font-extrabold {
  font-weight: 800;
}

.font-black {
  font-weight: 900;
}