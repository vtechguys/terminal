import React from "react";

const StyleSheet = {
  merge(...arrayOfStyleObject) {
    return Object.assign({}, ...arrayOfStyleObject);
  },
  terminal: {
    width: "100%",
    height: "100%",
    padding: 20,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    fontSize: 20,
    color: "#000",
    backgroundColor: "#000",
    // overflow: "scroll"
    // overflowY: 'scroll'
  },
  p: {
    padding: 0,
    margin: 0
  },
  spinner: {
    color: "#ff0000"
  },
  seperator: {
    color: "red",
    marginRight: 20
  },
  lineOutput: {
    display: "flex",
    flexDirection: "column",
    color: "#fff",
    padding: 10
  },
  lineOutputSeperatorCommand: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  lineOutputCommandResult: {
    display: "flex",
    flexWrap: "wrap",
    width: '100%',
  },
  lineInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    color: "#fff",
    fontSize: 20,
    padding: 10
  },
  lineInputInputElement: {
    backgroundColor: "transparent",
    outline: "none",
    border: "none",
    color: "#fff",
    width: '100%',
    fontSize: 20

  }
};
function LineOutput({ command, commandResult, seperator = "$" }) {
  return (
    <div style={StyleSheet.lineOutput}>
      <div style={StyleSheet.lineOutputSeperatorCommand}>
        <span style={StyleSheet.seperator}>{seperator}</span>
        <p style={StyleSheet.p}>{command}</p>
      </div>
      <pre style={StyleSheet.lineOutputCommandResult}>{commandResult}</pre>
    </div>
  );
}
function LineInput({ value, onChange, onKeyUp, seperator = "$" }) {
  return (
    <div style={StyleSheet.lineInput}>
      <span style={StyleSheet.seperator}>{seperator}</span>
      <input
        onChange={onChange}
        onKeyUp={onKeyUp}
        value={value}
        spellCheck="false"
        autoFocus
        style={StyleSheet.lineInputInputElement}
      />
    </div>
  );
}
function Spinner() {
  return (
    <p style={StyleSheet.merge(StyleSheet.p, StyleSheet.spinner)}>
      Processing...
    </p>
  );
}
export default class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      historyCursor: -1,
      isInputComplete: false,
      isProcessingComplete: true,
      command: ""
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.keyCodes = {
      ENTER: 13,
      UP: 38,
      DOWN: 40,
      ESC: 27
    };
    this.terminalStyles = {
      color: "#fff",
      backgroundColor: "#000",
      width: "100%",
      height: "100%",
      fontSize: 16
    };
  }
  pushCommand(id){
    setTimeout(() => {
      const updater = prevState => {
        const { history } = prevState;
        const index = history.findIndex(command => command.id === id);
        if (index === -1) {
          const stateMerge = {};
          return stateMerge;
        }
        const newHistory = [...history];
        newHistory[index] = {
          ...newHistory[index],
          result: `.   .env            .gitignore      node_modules    public          yarn.lock
          ..              .git            README.md       package.json    src`
        };

        const stateMerge = {
          history: newHistory,
          isInputComplete: false,
          isProcessingComplete: true,
          command: ""
        };
        return stateMerge;
      };
      this.setState(updater);
    }, 1000);
  }
  handleEnterPress() {
    const { commands } = this.props;
    const stream = this.state.command.split(" ");
    const cmd = stream[0];
    stream.splice(0, 1);
    const args = stream;
    const isStaticCommand = commands && commands[cmd] ? true : false; 

    const id = Date.now() + "_" + Math.floor(Math.random() * 100);
    const updater = prevState => {
      const { history, historyCursor, command } = prevState;
      const currentCommand = {
        id,
        command,
        result: null
      };

      const newHistory = history.concat(currentCommand);
      const stateMerge = {
        history: newHistory,
        historyCursor: historyCursor + 1,
        isInputComplete: true,
        isProcessingComplete: false
      };
      if(isStaticCommand){
        stateMerge.isProcessingComplete = true;
        stateMerge.command = "";
        newHistory[newHistory.length - 1].result = commands[cmd].fn(...args);
      }
      return stateMerge;
    };
    this.setState(updater);
    if(!isStaticCommand){
      this.pushCommand(id);
    }
    
  }
  handleUpDownKeys(isUpperKey = true) {
    const updater = prevState => {
      const { historyCursor, history } = prevState;
      let newHistoryCursor = historyCursor;
      if (isUpperKey) {
        if (newHistoryCursor - 1 >= 0) {
          newHistoryCursor = newHistoryCursor - 1;
        }
      } else {
        if (newHistoryCursor + 1 <= history.length - 1) {
          newHistoryCursor = newHistoryCursor + 1;
        }
      }
      if (newHistoryCursor === -1) {
        return {};
      }
      const command = history[newHistoryCursor].command;
      const stateMerge = {
        historyCursor: newHistoryCursor,
        command
      };
      return stateMerge;
    };
    this.setState(updater);
  }
  handleEscKey() {
    console.log("escape key");
  }
  onKeyUpHandler(e) {
    e.preventDefault();
    const { keyCode } = e;
    if (keyCode === this.keyCodes.ENTER) {
      this.handleEnterPress();
    } else if (keyCode === this.keyCodes.UP || keyCode === this.keyCodes.DOWN) {
      this.handleUpDownKeys(keyCode === this.keyCodes.UP ? true : false);
    } else if (keyCode === this.keyCodes.ESC) {
      this.handleEscKey();
    }
  }
  onChangeHandler(e) {
    let value = e.target.value;
    if(value && value.trim().length > 0){
  
      return this.setState({
        command: value
      });
    }
    
  }
  applyStyles() {
    const { style } = this.props;
    if (style) {
      return {
        ...StyleSheet.terminal,
        ...style
      };
    }
    return this.terminalStyles;
  }
  render() {
    const { history, isProcessingComplete } = this.state;
    const { seperator, } = this.props;
    let jsx = null;
    if (history && history.length > 0) {
      const listPrevious = history.map(command => {
        return (
          <LineOutput
            key={command.id}
            command={command.command}
            commandResult={command.result}
            seperator={seperator}
          />
        );
      });
      let nextLineJSX = null;
      if (!isProcessingComplete) {
        nextLineJSX = <Spinner />;
      } else {
        nextLineJSX = (
          <LineInput
            onChange={this.onChangeHandler}
            onKeyUp={this.onKeyUpHandler}
            value={this.state.command}
            seperator={seperator}
          />
        );
      }
      jsx = (
        <>
          {listPrevious}
          <br />
          {nextLineJSX}
        </>
      );
    } else {
      jsx = (
        <LineInput
          value={this.state.command}
          onKeyUp={this.onKeyUpHandler}
          onChange={this.onChangeHandler}
          seperator={seperator}
        />
      );
    }
    return <div style={StyleSheet.terminal}>{jsx}</div>;
  }
}
