import {Config} from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
// Frames are captured as JPEG; at the default 80 skin and gradients lose detail.
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
// A near-lossless master: scripts/finalize.py makes the one delivery encode.
Config.setCrf(12);
Config.setPixelFormat("yuv420p");
// 3D scenes need WebGL. On the laptop ANGLE uses the Intel GPU; the GitHub
// runner has no GPU, so the workflow overrides this with software rendering.
Config.setChromiumOpenGlRenderer("angle");
