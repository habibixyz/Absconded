# Project Rules - Style & Compilation Preservation

## 1. CSS & Layout Imports
- **CRITICAL**: Never modify, delete, or re-order the `@import` statement at the absolute top of `app/globals.css`. It must always precede any Tailwind CSS directives (e.g., `@tailwind base;`) to prevent PostCSS parsing and layout breakages in Next.js.
- **CRITICAL**: Never remove or alter the `import './globals.css'` declaration at the top of `app/layout.jsx`.

## 2. Dev Server Caching
- Next.js development server on Windows is prone to Webpack hot-reloading chunk desyncs whenever a syntax error occurs. 
- If a build error is encountered and corrected, the browser will often display a blank or unstyled page due to cached broken chunks. 
- Always instruct the user to perform a **Hard Reload (`Ctrl + F5` or `Cmd + Shift + R`)** to pull the fresh CSS assets.
