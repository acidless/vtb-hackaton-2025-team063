import type {NextConfig} from "next";
import {version} from "./package.json";

const nextConfig: NextConfig = {
    reactCompiler: true,
    redirects() {
        return [{source: "/", destination: "/dashboard", statusCode: 302}];
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: version,
    },
};

export default nextConfig;
