import {staticFile} from "remotion";
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {HDRLoader} from "three/examples/jsm/loaders/HDRLoader.js";

// The studio's real materials and models, all CC0 from Poly Haven (projects/sharaab-fayda/
// credits.txt): black walnut veneer for the table, painted plaster for the wall, brown
// leather grain, the brown_photostudio_02 HDRI for reflections, a scanned wine bottle
// (fictional labels) and a vintage oil lamp. Loaded once per page and cloned per canvas.

export type PBR = {map: THREE.Texture; normal: THREE.Texture; rough: THREE.Texture};
export type Assets = {walnut: PBR; plaster: PBR; leather: PBR; env: THREE.Texture; bottle: THREE.Object3D; lamp: THREE.Object3D; who: THREE.Texture; lancet: THREE.Texture};

const dir = (f: string) => staticFile(`sharaab/${f}`);
let promise: Promise<Assets> | null = null;

const pbr = async (loader: THREE.TextureLoader, id: string, repeat: [number, number]): Promise<PBR> => {
  const [map, normal, rough] = await Promise.all(["diff", "nor", "rough"].map((k) => loader.loadAsync(dir(`${id}_${k}.jpg`))));
  map.colorSpace = THREE.SRGBColorSpace;
  for (const t of [map, normal, rough]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
    t.anisotropy = 8;
  }
  return {map, normal, rough};
};

export const loadAssets = () => {
  if (!promise) {
    promise = (async () => {
      const tl = new THREE.TextureLoader();
      const gl = new GLTFLoader();
      const [walnut, plaster, leather, env, bottleGltf, lampGltf, who, lancet] = await Promise.all([
        pbr(tl, "black_walnut_veneer_01", [2.2, 2.2]),
        pbr(tl, "painted_plaster_wall", [3, 1.8]),
        pbr(tl, "brown_leather", [1.4, 1.4]),
        new HDRLoader().loadAsync(dir("brown_photostudio_02_1k.hdr")),
        gl.loadAsync(dir("wine_bottles_01/wine_bottles_01_1k.gltf")),
        gl.loadAsync(dir("vintage_oil_lamp/vintage_oil_lamp_1k.gltf")),
        // The two real documents, captured 2026-11-22 (research.md): WHO's news release and
        // the Lancet paper's PubMed Central record (CC BY 4.0). They live in public/footage (not
        // committed) and reach the GitHub render through the draft release, like footage.
        tl.loadAsync(staticFile("footage/sf-who-2024-06-25.png")),
        tl.loadAsync(staticFile("footage/sf-lancet-gbd2020-pmc.png")),
      ]);
      for (const t of [who, lancet]) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 16;
      }
      env.mapping = THREE.EquirectangularReflectionMapping;

      // One bottle from the set: the one in green glass, moved to the origin.
      let bottle: THREE.Object3D | null = null;
      for (const child of bottleGltf.scene.children) {
        let green = false;
        child.traverse((o) => {
          const m = (o as THREE.Mesh).material as THREE.Material | undefined;
          if (m && m.name.includes("glass_green")) green = true;
        });
        if (green) bottle = child;
      }
      if (!bottle) bottle = bottleGltf.scene.children[0];
      bottle.position.set(0, 0, 0);
      bottle.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          const m = mesh.material as THREE.MeshPhysicalMaterial;
          if (m.transmission) {
            m.thickness = Math.max(m.thickness, 0.6);
            m.envMapIntensity = 1.3;
          }
        }
      });

      const lamp = lampGltf.scene;
      lamp.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (m.name.includes("flame")) {
          m.emissive = new THREE.Color("#FFB45A");
          m.emissiveIntensity = 6;
          m.toneMapped = false;
        } else if (m.name.includes("glass")) {
          m.transparent = true;
          m.opacity = 0.28;
          m.roughness = 0.05;
          m.depthWrite = false;
        }
      });
      return {walnut, plaster, leather, env, bottle, lamp, who, lancet};
    })();
  }
  return promise;
};

// Height of an object's bounding box, for scaling a model to the studio.
export const heightOf = (o: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(o);
  return box.max.y - box.min.y;
};
