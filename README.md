# React API Hook Auth App
This is a simple React application that demonstrates how to use a custom useAPI hook to make various API calls (GET, POST, PUT, DELETE) and handle authentication using a token.

## Features

* **Custom `useAPI` Hook**: Centralized API call logic with support for `GET`, `POST`, `PUT`, and `DELETE` requests.
* **Authentication**: Login functionality using the ReqRes.in API to fetch and store a bearer token.
* **CRUD Operations**: Examples of fetching users, creating a new user, updating a user, and deleting a user.

## Files

* **`App.jsx`**: Main component that handles UI and API interactions.
* **`hooks/useAPI.js`**: Custom hook for making API requests.

## Getting Started

Clone or download the repository, and install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open your browser and navigate to http://localhost:5173 to view the app.

## Scripts

* `npm run dev`: Starts the development server.
* `npm run build`: Builds the project for production.
* `npm run lint`: Runs ESLint to check for code issues.
* `npm run preview`: Previews the production build locally.

## Dependencies

* **React**: ^19.0.0
* **Vite**: ^6.2.0
* **ESLint**: ^9.21.0