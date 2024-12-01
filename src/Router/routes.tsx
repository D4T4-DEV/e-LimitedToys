import { RouteObject, useRoutes } from "react-router-dom";
import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import MyProfile from '../pages/MyProfile';
import ProductCatalog from '../pages/ProductCatalog';
import useMonitorCookie from "../Cookies/monitorCookies";
import Contact from "../pages/Contact";


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
  },
  {
    path: '/mi-perfil',
    element: <MyProfile />,
  },
  {
    path: '/contact',
    element: <Contact/>,
  }
];

export const AppRoutes: React.FC = () => {
  // Cuando se inice, estas funciones se aplicaran
  useMonitorCookie('isLoggedIn');
  useMonitorCookie('sessionKey');
  const routing = useRoutes(routes); 
  return <>{routing}</>;
};
