import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import PublicLayout from "./layout/PublicLayout"
import { Children } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export const Router = createBrowserRouter([
    {
        path:"/",
        element:<PublicLayout></PublicLayout>,
        children:[
            {index: true, element:<Home/>}
        ]

    }
])