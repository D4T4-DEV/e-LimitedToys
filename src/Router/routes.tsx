import { RouteObject, useRoutes } from "react-router-dom";
import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import ProductCatalog from '../pages/ProductCatalog';
import useMonitorCookie from "../Cookies/monitorCookies";


const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/catalog',
    element: <ProductCatalog />,
  }
];

export const AppRoutes: React.FC = () => {
  useMonitorCookie('isLoggedIn');
  useMonitorCookie('sessionKey');
  const routing = useRoutes(routes); // Ahora se ejecuta dentro del contexto del Router
  return <>{routing}</>;
};
