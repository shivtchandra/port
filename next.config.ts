import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // React Compiler disabled: its memoization breaks framer-motion's
  // whileInView / mount-animate reveals (they stick at the initial state).
  reactCompiler: false,
};

export default nextConfig;
