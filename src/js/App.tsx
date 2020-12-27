import "../css/App.css";
import React, { Component, FunctionComponent } from "react";
import * as THREE from "three";
import { readConfigFile } from "typescript";
import Tree from "./Tree";

type AppState = {
  appWidth: number;
  appHeight: number;
};

export class App extends Component<{}, AppState> {
  constructor(props: AppState) {
    super(props);
    this.state = {
      appWidth: window.innerWidth,
      appHeight: window.innerHeight,
    };

    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    this.setState({
      appWidth: window.innerWidth,
      appHeight: window.innerHeight,
    });
  }

  render() {
    return (
      <div className="App">
        <Tree
          width={this.state.appWidth}
          height={this.state.appHeight}
          treeID="firstTree"
        />
      </div>
    );
  }
}

export default App;
