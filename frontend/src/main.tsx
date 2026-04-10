
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import axios from "axios";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { ThemeProvider } from "./components/ThemeContext.tsx";

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
);
