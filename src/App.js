import Login from "./components/login";
import Register from "./components/register";

import Home from "./components/home";

import {AuthProvider} from "./authContexts";
import {BrowserRouter as Router, useRoutes,} from "react-router-dom";

const App = () => {
  return useRoutes([
    {
      path: "*",
      element: <Login/>,
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/register",
      element: <Register/>,
    },
    {
      path: "/home",
      element: <Home/>,
    },
  ]);
};

const AppWrapper = () => {
  return (
    <Router>
      <AuthProvider>
         <App />
      </AuthProvider>
    </Router>
  );
};

export default AppWrapper;

