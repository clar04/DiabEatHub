import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";

// pages
import Home from "./pages/Home.jsx";
import Food from "./pages/Food.jsx";
import Packaged from "./pages/Packaged.jsx";
import Recipes from "./pages/Recipes.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import History from "./pages/History.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

// contexts
import { ProfileProvider } from "./state/ProfileContext.jsx";
import { GoalProvider } from "./state/GoalContext.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "food", element: <Food /> },
      { path: "products", element: <Packaged /> }, // path utama
      { path: "packaged", element: <Packaged /> }, // alias biar /packaged juga jalan
      { path: "recipes", element: <Recipes /> },
      { path: "recipes/:id", element: <RecipeDetail /> },
      { path: "history", element: <History /> },
      { path: "about", element: <About /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProfileProvider>
      <GoalProvider>
        <RouterProvider router={router} />
      </GoalProvider>
    </ProfileProvider>
  </StrictMode>
);
