import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Master } from "./master/Master.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			{/* <App /> */}
			<Master />
			<Toaster position="top-right" />
		</BrowserRouter>
	</React.StrictMode>
);
