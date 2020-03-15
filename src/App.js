import React from "react";
import Terminal from "./terminal";
const commands = {
  echo: {
    usage: 'exec <message>',
    description:'outputs message',
    fn: (...args) => {
      return args.join(" ");
    }
  }
};
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Terminal seperator="#" commands={commands}/>
    </div>
  );
}

export default App;
