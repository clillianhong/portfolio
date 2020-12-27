import React, { Component } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import ThreeScene from "./ThreeScene";

export async function LoadMesh(meshPath: string): Promise<THREE.Group> {
  const loader = new OBJLoader(THREE.DefaultLoadingManager);
  return new Promise<THREE.Group>(function (resolve, reject) {
    loader.load(
      meshPath,
      (obj) => {
        resolve(obj);
      },
      () => console.log("loading"),
      (error) => reject(error)
    );
  });
}
