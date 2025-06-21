import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { analytics } from "@naive-analytics/script";

analytics(import.meta.env.VITE_ANALYTICS_URL, import.meta.env.VITE_ANALYTICS_API_KEY);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
