import React, { Component } from "react";
import * as THREE from "three";
import { readConfigFile } from "typescript";

type ThreeSceneState = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  currentScene: THREE.Scene;
  width: number;
  height: number;
};

export type ThreeSceneProps = {
  width: number;
  height: number;
};

export class ThreeScene extends Component<ThreeSceneProps, ThreeSceneState> {
  mount = React.createRef<HTMLDivElement>();
  frameId?: number = undefined;

  //EXAMPLE CUBE CODE ---------------------
  cube?: THREE.Mesh = undefined;
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
    this.cube = this.GreenCube();
    //EXAMPLE CUBE CODE ---------------------
  }

  //EXAMPLE CUBE CODE ---------------------
  GreenCube() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
  }
  //EXAMPLE CUBE CODE ---------------------

  componentDidMount() {
    if (this.mount! === undefined) return;
    this.mount.current!.appendChild(this.state.renderer.domElement);

    var scene = this.state.currentScene;
    var camera = this.state.camera;

    //EXAMPLE CUBE CODE ---------------------
    this.cube && scene.add(this.cube);
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
    if (!this.cube) return;
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    //EXAMPLE CUBE CODE ---------------------

    renderer.render(scene, camera);

    this.frameId = window.requestAnimationFrame(this.animate);
  };

  render() {
    return <div className="ThreeScene" ref={this.mount}></div>;
  }
}

export default ThreeScene;
