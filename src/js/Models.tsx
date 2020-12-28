import React, { Component } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import ThreeScene from "./ThreeScene";

export async function LoadMesh(
  meshPath: string,
  materialPath: string
): Promise<THREE.Group> {
  return new Promise<THREE.Group>(function (resolve, reject) {
    var mtlLoader = new MTLLoader(THREE.DefaultLoadingManager);
    mtlLoader.load(materialPath, function (materials) {
      materials.preload();
      var loader = new OBJLoader(THREE.DefaultLoadingManager);
      loader.setMaterials(materials);
      loader.load(
        meshPath,
        (obj) => {
          resolve(obj);
        },
        () => console.log("loading"),
        (error) => reject(error)
      );
    });
  });
}
