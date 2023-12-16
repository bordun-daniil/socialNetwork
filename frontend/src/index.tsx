import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./state/store";
import App from "./App";
import "./styles/main.scss";

const rootNode = document.getElementById("root");

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootNode
);
