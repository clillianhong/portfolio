import React, { Component } from "react";
import * as THREE from "three";
import { readConfigFile } from "typescript";
import ThreeScene, { ThreeSceneState, ThreeSceneProps } from "./ThreeScene";

export interface TreeState extends ThreeSceneState {
  treeID: string;
}

export interface TreeProps extends ThreeSceneProps {
  treeID: string;
}

export class Tree extends Component<TreeProps, TreeState> {
  mount = React.createRef<HTMLDivElement>();
  frameId?: number = undefined;
  threeScene?: ThreeScene = undefined;

  constructor(props: TreeProps) {
    super(props);
    this.threeScene = new ThreeScene(props);

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
      //new tree props
      treeID: props.treeID,
    };
  }

  GreenCube() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  componentDidMount() {
    if (this.mount! === undefined) return;
    this.mount.current!.appendChild(this.state.renderer.domElement);

    var scene = this.state.currentScene;
    var camera = this.state.camera;

    //EXAMPLE CUBE CODE ---------------------
    //add objects to scene
    scene.add(this.GreenCube());
    //EXAMPLE CUBE CODE ---------------------
    this.start();
    camera.position.z = 5;
  }

  componentDidUpdate(prevProps: TreeProps) {
    this.threeScene && this.threeScene.componentDidUpdate.call(this, prevProps);
  }

  componentWillUnmount() {
    this.threeScene && this.threeScene.componentWillUnmount.call(this);
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
    return <div className={this.state.treeID} ref={this.mount}></div>;
  }
}

export default Tree;
