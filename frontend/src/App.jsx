import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login.jsx'
import Register from './Register.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

function App() {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <><Login/></>
      },
      {
        path: "/login",
        element: <><Login /></>
      },
      {
        path: "/register",
        element: <><Register /></>
      },
      
    ])
    return <RouterProvider router={router} />;
}
export default App;
