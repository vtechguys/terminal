import React from "react";
import Terminal from "./terminal";
const commands = {
  echo: {
    usage: "echo <message>",
    description: "outputs message",
    fn: (...args) => {
      if (args.length === 0) {
        return "echo <message>";
      }
      return args.join(" ");
    }
  },
  ls: {
    usage: "ls",
    description: "list content of current dir",
    fn: () =>{
      return `
        node_modules
        public
        src
        .env
        .gitignore
        package.json
        README.md
        yarn.lock
      `;
    }
  }
};
function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: 'hidden' }}>
      <Terminal seperator="#" commands={commands} />
    </div>
  );
}

export default App;
