import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Скрываем экран загрузки после монтирования приложения
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.add("hidden");
    // Удаляем элемент из DOM после анимации
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
};

// Монтируем приложение
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Скрываем экран загрузки после небольшой задержки для плавности
setTimeout(hideLoadingScreen, 300);
