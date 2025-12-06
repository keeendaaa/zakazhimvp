import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Удаляем экран загрузки сразу
const loadingScreen = document.getElementById("loading-screen");
if (loadingScreen) {
  loadingScreen.remove();
}

// Монтируем приложение
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
