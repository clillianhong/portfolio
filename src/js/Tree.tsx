import React, { Component } from "react";
import * as THREE from "three";
import ThreeScene, { ThreeSceneState, ThreeSceneProps } from "./ThreeScene";
import { LoadMesh } from "./Models";
import "../css/App.css";

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
  tree?: THREE.Group = undefined;

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

  /**
   * helper function - just generates a green cube mesh
   */
  GreenCube() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  /**
   * Adds treeGroup to the current scene after to handle mesh load event
   * @param treeGroup
   */
  handleAddTreeLoad(treeGroup: THREE.Group): THREE.Scene {
    var scene = this.state.currentScene;
    this.tree = treeGroup;
    //create trees
    for (var x = -12; x < 12; x += 2) {
      if (this.tree) {
        var tree2 = this.tree.clone();
        tree2.position.set(
          tree2.position.x + x,
          tree2.position.y,
          tree2.position.z
        );
        scene.add(tree2);
      }
    }
    return scene;
  }

  /**
   * Adds all lights to scene
   * @param scene
   */
  addLights(scene: THREE.Scene): THREE.Scene {
    const light = new THREE.PointLight(0xffffff, 50, 100);
    light.position.set(50, 50, 50); // soft white light
    scene.add(light);
    return scene;
  }

  componentDidMount() {
    if (this.mount! === undefined) return;
    this.mount.current!.appendChild(this.state.renderer.domElement);

    var treeGroupPromise = LoadMesh(
      "/models/lowpolytree.obj",
      "/models/lowpolytree.mtl"
    );
    treeGroupPromise
      .then(this.handleAddTreeLoad.bind(this))
      .then(this.addLights)
      .then((scene) => {
        //set up camera and save state
        var camera = this.state.camera;
        camera.position.z = 12;
        this.setState({
          currentScene: scene,
          camera: camera,
        });
        this.start();
      });
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

    //EXAMPLE CUBE CODE ---------------------

    renderer.render(scene, camera);

    this.frameId = window.requestAnimationFrame(this.animate);
  };

  render() {
    return <div className={"treeStyle"} ref={this.mount}></div>;
  }
}

export default Tree;
