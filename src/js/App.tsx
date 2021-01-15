import "../css/App.css";
import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import Projects from "./Projects";
import LandingPage from "./LandingPage";
import Thumbnail from "./Thumbnail";
import Planet from "./Planet";
import Tree from "./Tree";
import Background from "./Background";

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
      <Planet
        width={800}
        height={800}
        planetRadius={100}
        orbitInnerRadius={200}
        orbitOuterRadius={220}
        orbitTilt={20}
        planetColor={0x6e160f}
        orbitColor={0x00ff00}
      />

      // <BrowserRouter>
      //   <div className="App">
      //     <Route exact path="/" component={LandingPage} />
      //     <Route exact path="/projects" component={Projects} />
      //     <div className="navigation">
      //       {/* <img src={logo} className="logo-image" alt="Logo Image" /> */}
      //       <div className="navigation-sub">
      //         <Link to="/" className="item">
      //           Main
      //         </Link>
      //         <Link to="/projects" className="item">
      //           Projects
      //         </Link>
      //         {/* <Link to="/articles" className="item">Articles</Link> */}
      //         {/* <Link to="/about" className="item">About</Link> */}
      //       </div>
      //     </div>
      //   </div>
      // </BrowserRouter>
    );
  }
}

export default App;
