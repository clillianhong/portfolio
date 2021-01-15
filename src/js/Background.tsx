import React from "react";
import * as THREE from "three";
import "../css/App.css";

let EffectComposer, RenderPass, BloomPass;

export default function Background() {
  const backgroundContainer = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer")
      .EffectComposer;
    RenderPass = require("three/examples/jsm/postprocessing/RenderPass")
      .RenderPass;
    BloomPass = require("three/examples/jsm/postprocessing/BloomPass")
      .BloomPass;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    backgroundContainer.current?.appendChild(renderer.domElement);
    var geometry = new THREE.PlaneGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new BloomPass(
      1, // strength
      25, // kernel size
      4, // sigma ?
      256 // blur render target resolution
    );
    composer.addPass(bloomPass);

    var animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      composer.render();
    };
    animate();
  }, []);
  return (
    <section className={"planetDivStyle"} ref={backgroundContainer}></section>
  );
}
