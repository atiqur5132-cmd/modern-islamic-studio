import {useFrame, useThree} from "@react-three/fiber";
import {BloomEffect, BlendFunction, BrightnessContrastEffect, HueSaturationEffect, DepthOfFieldEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, ToneMappingEffect, ToneMappingMode, VignetteEffect} from "postprocessing";
import {useEffect, useMemo} from "react";
import * as THREE from "three";

// The lens: depth of field focused on the subject (`focus`, a world point), a soft bloom on
// the brass highlights and the lamp flame, a gentle vignette, then filmic tone mapping.
// It replaces react-three-fiber's own render (useFrame with priority 1).
export const Post = ({focus, bokeh = 3.2, range = 0.9}: {focus: [number, number, number]; bokeh?: number; range?: number}) => {
  const {gl, scene, camera, size} = useThree();
  const fx = useMemo(() => {
    const composer = new EffectComposer(gl, {frameBufferType: THREE.HalfFloatType, multisampling: 4});
    composer.addPass(new RenderPass(scene, camera));
    const dof = new DepthOfFieldEffect(camera, {worldFocusDistance: 3, worldFocusRange: 0.9, bokehScale: 3.2, resolutionScale: 1});
    dof.target = new THREE.Vector3();
    composer.addPass(new EffectPass(camera, dof));
    const bloom = new BloomEffect({intensity: 0.55, luminanceThreshold: 0.78, luminanceSmoothing: 0.25, mipmapBlur: true, radius: 0.7});
    const vignette = new VignetteEffect({offset: 0.32, darkness: 0.55, blendFunction: BlendFunction.NORMAL});
    const tone = new ToneMappingEffect({mode: ToneMappingMode.AGX});
    composer.addPass(new EffectPass(camera, bloom, vignette, tone));
    // A light grade after tone mapping: a touch more contrast and colour.
    composer.addPass(new EffectPass(camera, new BrightnessContrastEffect({contrast: 0.1}), new HueSaturationEffect({saturation: 0.14})));
    composer.addPass(new EffectPass(camera, new SMAAEffect()));
    return {composer, dof};
  }, [gl, scene, camera]);
  useEffect(() => {
    fx.composer.setSize(size.width, size.height);
    return () => fx.composer.dispose();
  }, [fx, size.width, size.height]);
  fx.dof.target!.set(...focus);
  fx.dof.bokehScale = bokeh;
  fx.dof.cocMaterial.worldFocusRange = range;
  useFrame(() => {
    fx.composer.render();
  }, 1);
  return null;
};
