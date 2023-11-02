import { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route, // Dodaj import dla komponentu Route
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profil from "./pages/profil/Profil";
import Wiadomosci from "./pages/wiadomosci/Wiadomosci";
import UserProfil from "./pages/profil/UserProfile";
function App() {
  const { currentUser } = useContext(AuthContext);

  const AuthRoute = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: `/userprofile/:userUID`,
      element: <UserProfil />,
    },
    {
      path: `/profil/${currentUser?.uid}`,
      element: <Profil />,
    },
    {
      path: "/wiadomosci",
      element: <Wiadomosci />,
    },
    {
      path: "/",
      element: (
        <AuthRoute>
          <Home />
        </AuthRoute>
      ),
    },
  ]);
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
