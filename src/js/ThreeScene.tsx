import React, { Component } from "react";
import * as THREE from "three";

export interface ThreeSceneState {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  currentScene: THREE.Scene;
  width: number;
  height: number;
}

export interface ThreeSceneProps {
  width: number;
  height: number;
}

export class ThreeScene extends Component<ThreeSceneProps, ThreeSceneState> {
  mount = React.createRef<HTMLDivElement>();
  frameId?: number = undefined;

  //EXAMPLE CUBE CODE ---------------------
  //state variable
  //EXAMPLE CUBE CODE ---------------------

  constructor(props: ThreeSceneProps) {
    super(props);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(props.width, props.height);
    this.state = {
      renderer: renderer,
      camera: new THREE.PerspectiveCamera(
        75,
        props.width / props.height,
        0.1,
        1000
      ),
      currentScene: new THREE.Scene(),
      width: props.width,
      height: props.height,
    };

    //EXAMPLE CUBE CODE ---------------------
    // instantiate objects
    //EXAMPLE CUBE CODE ---------------------
  }

  componentDidMount() {
    if (this.mount! === undefined) return;
    this.mount.current!.appendChild(this.state.renderer.domElement);

    var scene = this.state.currentScene;
    var camera = this.state.camera;

    //EXAMPLE CUBE CODE ---------------------
    //add objects to scene
    //EXAMPLE CUBE CODE ---------------------

    camera.position.z = 5;
    this.start();
  }

  componentDidUpdate(prevProps: ThreeSceneProps) {
    if (prevProps === this.props) return;
    // this.stop();
    var renderer = this.state.renderer;
    renderer.setSize(this.props.width, this.props.height);
    var camera = this.state.camera;
    camera.aspect = this.props.width / this.props.height;
    camera.updateProjectionMatrix();

    this.setState({
      renderer: renderer,
      camera: camera,
      width: this.props.width,
      height: this.props.height,
    });
  }

  componentWillUnmount() {
    this.stop();
    if (this.mount! === undefined) return;
    this.mount.current!.removeChild(this.state.renderer.domElement);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  };

  animate = () => {
    var scene = this.state.currentScene;
    var camera = this.state.camera;
    var renderer = this.state.renderer;

    //EXAMPLE CUBE CODE ---------------------
    //change object state
    //EXAMPLE CUBE CODE ---------------------

    renderer.render(scene, camera);

    this.frameId = window.requestAnimationFrame(this.animate);
  };

  render() {
    return <div className="ThreeScene" ref={this.mount}></div>;
  }
}

export default ThreeScene;
