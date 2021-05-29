import { createBus } from "@twopm/furo";
import { HistoryDebugger } from "@twopm/furo/lib/HistoryDebugger";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { Message, MessageContext } from "./messages";
import reportWebVitals from "./reportWebVitals";

// Cofigure whether debugging is enabled
const bus = createBus<Message>(true);

ReactDOM.render(
  <StrictMode>
    <MessageContext.Provider value={bus}>
      <App />
      <hr />
      <HistoryDebugger context={MessageContext} />
    </MessageContext.Provider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
