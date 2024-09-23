import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./components/navigation";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-accont";
import Chat from "./routes/chat";
import { createGlobalStyle } from "styled-components";
import { useState, useEffect } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import { styled } from "styled-components";
import ProtectedRoute from "./components/protected-route";
import ChatRooms from "./routes/chatrooms";
import ChatAdd from "./routes/chatadd";
import Intro from "./routes/intro";
import Survey from "./routes/survey";
import History from "./routes/history";
import Invite from "./routes/invite";
import ChatroomsSurvey from "./routes/chatrooms-survey";
// 폰트 추가
import GmarketSansTTFBold from "./fonts/GmarketSansTTFBold.ttf";
import GmarketSansTTFMedium from "./fonts/GmarketSansTTFMedium.ttf";
import GmarketSansTTFLight from "./fonts/GmarketSansTTFLight.ttf";
import Jalnan2TTF from "./fonts/Jalnan2TTF.ttf";
import React from 'react';
import { ChatRoomProvider } from './components/ChatRoomContext';
import { AccessTokenProvider } from "./components/TokenContext";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigation />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "chatrooms",
        element: <ChatRooms />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "chatadd",
        element: <ChatAdd />,
      },
      {
        path: "",
        element: <Intro />,
      },
      {
        path: "History",
        element: <History />,
      },

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/create-account", element: <CreateAccount /> },
  {
    path: "",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/create-account", element: <CreateAccount /> },
  {
    path: "",
    element: <Home />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "chat",
    element: <Chat />,
  },
  {
    path: "survey",
    element: <Survey />,
  },
  {
    path: "chatrooms-survey",
    element: <ChatroomsSurvey />,
  },
  {
    path: "invite/:chatroomId",
    element: <Invite />,
  },
]);

// 여기에 폰트 추가 가능
const GlobalStyles = createGlobalStyle`

@font-face {
        font-family: 'GmarketSansTTFBold';
        src: local('GmarketSansTTFBold'), local('GmarketSansTTFBold');
        font-style: normal;
        src: url(${GmarketSansTTFBold}) format('truetype');
  }
  @font-face {
        font-family: 'GmarketSansTTFMedium';
        src: local('GmarketSansTTFMedium'), local('GmarketSansTTFMedium');
        font-style: normal;
        src: url(${GmarketSansTTFMedium}) format('truetype');
  }
  @font-face {
        font-family: 'GmarketSansTTFLight';
        src: local('GmarketSansTTFLight'), local('GmarketSansTTFLight');
        font-style: normal;
        src: url(${GmarketSansTTFLight}) format('truetype');
  }
  @font-face {
        font-family: 'Jalnan2TTF';
        src: local('Jalnan2TTF'), local('Jalnan2TTF');
        font-style: normal;
        src: url(${Jalnan2TTF}) format('truetype');
  }
  
  * {
    box-sizing: border-box;
    
  }
    
  body {
    background-color: white;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    overflow-y:hidden;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  overflow-y: hidden;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    //wait for firebase
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <AccessTokenProvider>
    <ChatRoomProvider> {/* ChatRoomProvider 추가 */}
      <Wrapper>
        <GlobalStyles />
        {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      </Wrapper>
    </ChatRoomProvider>
    </AccessTokenProvider>
  );
}

export default App;
