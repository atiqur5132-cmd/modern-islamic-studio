import {Config} from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
// 3D scenes need WebGL. On the laptop ANGLE uses the Intel GPU; the GitHub
// runner has no GPU, so the workflow overrides this with software rendering.
Config.setChromiumOpenGlRenderer("angle");
