import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	cacheComponents: true,
	reactCompiler: true,
};

export default nextConfig;
