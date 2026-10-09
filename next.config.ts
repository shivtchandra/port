import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // React Compiler disabled: its memoization breaks framer-motion's
  // whileInView / mount-animate reveals (they stick at the initial state).
  reactCompiler: false,
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
