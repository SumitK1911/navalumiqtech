import type { NextConfig } from "next";

import os from "os";

const getLocalOrigins = (): string[] => {
  const origins = ["localhost", "127.0.0.1"];
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    const netList = interfaces[name];
    if (netList) {
      for (const net of netList) {
        if (net.family === "IPv4") {
          origins.push(net.address);
          origins.push(`${net.address}:3000`);
          origins.push(`${net.address}:3001`);
          origins.push(`${net.address}:3002`);
        }
      }
    }
  }
  return origins;
};

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalOrigins(),
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
