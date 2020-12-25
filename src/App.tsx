import "./App.css";
import React, { Component } from "react";
import * as THREE from "three";
import { readConfigFile } from "typescript";

type AppState = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  currentScene: THREE.Scene;
};

export class App extends Component<{}, AppState> {
  mount = React.createRef<HTMLDivElement>();

  constructor(props: AppState) {
    super(props);
    this.state = {
      renderer: new THREE.WebGLRenderer(),
      camera: new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
      currentScene: new THREE.Scene(),
    };

    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    var renderer = this.state.renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);

    this.setState({
      camera: new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
      renderer: renderer,
    });
  }

  drawCube() {
    // === THREE.JS CODE START ===
    var scene = this.state.currentScene;
    var camera = this.state.camera;
    var renderer = this.state.renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);

    // document.body.appendChild(renderer.domElement);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    // === THREE.JS EXAMPLE CODE END ===
  }

  componentDidMount() {
    this.mount.current!.appendChild(this.state.renderer.domElement);
    this.drawCube();
  }

  render() {
    return <div className="App" ref={this.mount}></div>;
  }
}

export default App;
