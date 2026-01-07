# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Admin login (Firebase)

This project now uses Firebase Email/Password authentication for the admin panel.

1. In the Firebase Console, go to **Authentication > Sign-in method** and enable **Email/Password**.
2. Make sure the admin email/password account already exists in *Users*.
3. Start the dev server: `npm install` and `npm run dev`.
4. Visit `/admin-auth` to sign in with your admin email and password; successful sign-in redirects to `/admin`.

If you'd like, I can add a sign-out UI or role checks so only specific UIDs can access admin pages.
