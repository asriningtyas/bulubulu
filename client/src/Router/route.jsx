import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../Pages/LandingPage/Index";
import Auth from "../Pages/Auth/Index";
import Navbar from "../Components/Navbar";

// user
import Main from "../Pages/User/MainPage/Main.jsx";
import Search from "../Pages/User/SearchPage/Search.jsx";
import Chat from "../Pages/User/ChatPage/Chat.jsx";
import Profile from "../Pages/User/ProfilePage/Main.jsx";

// vet
import Vet from "../Pages/Vet/Main.jsx";
import ChatPage from "../Pages/Vet/ChatPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/vet",
        element: <Vet />,
      },
      {
        path: "/vet/chat",
        element: <ChatPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/welcome",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "*",
    element: <div>Not Found2</div>,
  },
]);
