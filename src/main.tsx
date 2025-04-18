import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import theme from "./themes/index.ts";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);
