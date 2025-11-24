// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";

// pages
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Food from "./pages/Food.jsx";
import Packaged from "./pages/Packaged.jsx";
import Recipes from "./pages/Recipes.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

// contexts
import { AuthProvider } from "./state/AuthContext.jsx";
import { ProfileProvider } from "./state/ProfileContext.jsx";
import { GoalProvider } from "./state/GoalContext.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // landing
      { index: true, element: <About /> },
      { path: "about", element: <About /> },

      // home (goal card + summary)
      { path: "home", element: <Home /> },

      { path: "food", element: <Food /> },
      { path: "products", element: <Packaged /> },
      { path: "packaged", element: <Packaged /> }, // alias
      { path: "recipes", element: <Recipes /> },
      { path: "recipes/:id", element: <RecipeDetail /> },
      { path: "history", element: <History /> },
      { path: "profile", element: <Profile /> },

      // auth
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // wildcard 404
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <GoalProvider>
          <RouterProvider router={router} />
        </GoalProvider>
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>
);
