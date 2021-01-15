import React, { Component } from "react";
import * as THREE from "three";
import ThreeScene, { ThreeSceneState, ThreeSceneProps } from "./ThreeScene";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

import "../css/App.css";
import { Vector3 } from "three";

export interface PlanetProps extends ThreeSceneProps {
  planetRadius: number;
  orbitInnerRadius: number;
  orbitOuterRadius: number;
  orbitTilt: number;
  planetColor: number;
  orbitColor: number;
}

export interface PlanetState extends ThreeSceneState {
  composer: EffectComposer;
  planetRadius: number;
  orbitInnerRadius: number;
  orbitOuterRadius: number;
  orbitTilt: number;
  planetColor: number;
  orbitColor: number;
  clock: THREE.Clock;
}

export class Planet extends Component<PlanetProps, PlanetState> {
  mount = React.createRef<HTMLDivElement>();
  frameId?: number = undefined;
  threeScene?: ThreeScene = undefined;

  quaternion = new THREE.Quaternion();
  axis = new THREE.Vector3(0, 1, 0);

  constructor(props: PlanetProps) {
    super(props);
    this.threeScene = new ThreeScene(props);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(props.width, props.height);
    renderer.autoClear = false;
    this.state = {
      renderer: renderer,
      composer: new EffectComposer(renderer),
      camera: new THREE.PerspectiveCamera(
        75,
        props.width / props.height,
        0.1,
        1000
      ),
      currentScene: new THREE.Scene(),
      width: props.width,
      height: props.height,
      //new planet props
      planetRadius: props.planetRadius,
      orbitInnerRadius: props.orbitInnerRadius,
      orbitOuterRadius: props.orbitOuterRadius,
      orbitTilt: props.orbitTilt,
      planetColor: props.planetColor,
      orbitColor: props.orbitColor,
      clock: new THREE.Clock(),
    };
  }

  componentDidMount() {
    if (this.mount! === undefined) return;
    this.mount.current!.appendChild(this.state.renderer.domElement);

    this.setupScene();
  }

  setupScene() {
    var camera = this.state.camera;
    var scene = this.state.currentScene;
    var composer = this.state.composer;

    camera.position.z = 2 * this.state.orbitOuterRadius;
    camera.position.y = 0.5 * this.state.orbitOuterRadius;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = this.addPlanet(scene);
    scene = this.addRings(scene);
    scene = this.addLights(scene);
    composer = this.initComposer(scene, camera, composer);

    this.setState({
      currentScene: scene,
      camera: camera,
      composer: composer,
    });
    this.start();
  }

  componentDidUpdate(prevProps: PlanetProps) {
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

    camera.position.applyQuaternion(
      this.quaternion.setFromAxisAngle(
        this.axis,
        Math.PI *
          2 *
          ((this.state.clock.getDelta() / this.state.orbitOuterRadius) * 1.5)
      )
    );
    camera.lookAt(new Vector3(0, 0, 0));

    this.frameId = window.requestAnimationFrame(this.animate);
    this.state.composer.render();

    this.setState({
      camera: camera,
    });
    renderer.render(scene, camera);
  };

  /**
   * Adds all lights to  scene
   * @param scene
   */
  addLights(scene: THREE.Scene): THREE.Scene {
    const ambientLight = new THREE.AmbientLight(0x404040);
    const pointLight = new THREE.PointLight(0xffffff, 10, 100);
    pointLight.position.set(50, 50, 50); // soft white light
    scene.add(ambientLight);
    scene.add(pointLight);
    return scene;
  }

  addPlanet(scene: THREE.Scene): THREE.Scene {
    var planet = new THREE.Object3D();
    planet.name = "planet";
    //create body
    const planetGeometry = new THREE.SphereGeometry(
      this.state.planetRadius,
      32,
      32
    );
    const planetMaterial = new THREE.MeshBasicMaterial({
      color: this.state.planetColor,
    });
    const planetSphere = new THREE.Mesh(planetGeometry, planetMaterial);

    planet.add(planetSphere);

    scene.add(planet);
    return scene;
  }

  addRings(scene: THREE.Scene): THREE.Scene {
    var rings = new THREE.Object3D();
    rings.name = "rings";
    //make rings
    const ringGeo = this.makeRings();
    const ringMat = new THREE.MeshLambertMaterial({
      color: this.state.orbitColor,
    });
    const planetRings = new THREE.Mesh(ringGeo, ringMat);
    planetRings.geometry.computeFaceNormals();
    planetRings.geometry.center();
    rings.add(planetRings);
    scene.add(rings);
    return scene;
  }

  makeRings(): THREE.Geometry {
    var rings = new THREE.Geometry();
    var toRad = Math.PI / 180;
    var xInnerRad =
      this.state.orbitInnerRadius * Math.cos(this.state.orbitTilt * toRad);
    var xOuterRad =
      this.state.orbitOuterRadius * Math.cos(this.state.orbitTilt * toRad);

    let twopi = 2 * Math.PI,
      iVer = Math.max(2, 150);
    for (let i = 0; i < iVer + 1; i++) {
      let fRad1 = i / iVer,
        fZ = xInnerRad * (Math.cos(fRad1 * twopi) - 0.5),
        fRad2 = (i + 1) / iVer,
        fX1 = xInnerRad * Math.cos(fRad1 * twopi),
        fY1 = xInnerRad * Math.sin(fRad1 * twopi),
        fX2 = xOuterRad * Math.cos(fRad1 * twopi),
        fY2 = xOuterRad * Math.sin(fRad1 * twopi),
        fX4 = xInnerRad * Math.cos(fRad2 * twopi),
        fY4 = xInnerRad * Math.sin(fRad2 * twopi),
        fX3 = xOuterRad * Math.cos(fRad2 * twopi),
        fY3 = xOuterRad * Math.sin(fRad2 * twopi),
        v1 = new THREE.Vector3(fX1, fZ, fY1),
        v2 = new THREE.Vector3(fX2, fZ, fY2),
        v3 = new THREE.Vector3(fX3, fZ, fY3),
        v4 = new THREE.Vector3(fX4, fZ, fY4);
      rings.vertices.push(v1);
      rings.vertices.push(v2);
      rings.vertices.push(v3);
      rings.vertices.push(v4);

      for (let i = 0; i < iVer + 1; i++) {
        var face1 = new THREE.Face3(i * 4, i * 4 + 1, i * 4 + 2);
        var face2 = new THREE.Face3(i * 4, i * 4 + 2, i * 4 + 3);
        var face3 = new THREE.Face3(i * 4 + 1, i * 4, i * 4 + 2);
        var face4 = new THREE.Face3(i * 4 + 2, i * 4, i * 4 + 3);

        rings.faces.push(face1);
        rings.faces.push(face2);
        rings.faces.push(face3);
        rings.faces.push(face4);
        rings.faceVertexUvs[0].push([
          new THREE.Vector2(0, 1),
          new THREE.Vector2(1, 1),
          new THREE.Vector2(1, 0),
        ]);
        rings.faceVertexUvs[0].push([
          new THREE.Vector2(0, 1),
          new THREE.Vector2(1, 0),
          new THREE.Vector2(0, 0),
        ]);
        rings.faceVertexUvs[0].push([
          new THREE.Vector2(0, 1),
          new THREE.Vector2(1, 1),
          new THREE.Vector2(1, 0),
        ]);
        rings.faceVertexUvs[0].push([
          new THREE.Vector2(0, 1),
          new THREE.Vector2(1, 0),
          new THREE.Vector2(0, 0),
        ]);
      }
    }

    return rings;
  }

  initComposer(
    scene: THREE.Scene,
    camera: THREE.Camera,
    composer: EffectComposer
  ): EffectComposer {
    var renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.state.width, this.state.height),
      1,
      0.5,
      0.85
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 4;
    bloomPass.radius = 0.75;
    composer.addPass(bloomPass);
    return composer;
  }

  render() {
    return <div className={"planetDivStyle"} ref={this.mount}></div>;
  }
}

export default Planet;
