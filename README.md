# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## For Pooling of DB, database_urls is stored into render's environment variable

## Sandboxing is used in form of session storage in order to avoid direct operations on the database. 2 sandboxes are used, 1 for storing result of valid query and 1 for result of the actual correct query expected, and compared against eaxh other to validate the result. 

## Github Oauth App created from settings/developer and used the secret key and Id generated as environment variable.

## Using Webhooks to send a bug report to discord and idirectly t othe user.

### Discord webhook - create a server/server settings/apps/integrations new woebhook = url https://discord.com/api/webhooks/1539800967245996032/HwlUjGpTfIWMEs_eZWJt_oCvTihQnkAknywrGzhFLmQKYEowUz07vS2ev4mlQ9hbtmZW  name - BugReporting