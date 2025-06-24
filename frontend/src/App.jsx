import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Home from './components/Home.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import GamePage from './components/GamePage.jsx'
import WordleGrid from './components/WordleGrid.jsx'

function App() {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <><Login/></>
      },
      {
        path: "/register",
        element: <><Register /></>
      },
      {
        path: "/Home",
        element: <><GamePage /></>
      },
      {
        path: "/game",
        element: <><WordleGrid /></>
      }
      
    ])
    return <RouterProvider router={router} />;
}
export default App;
