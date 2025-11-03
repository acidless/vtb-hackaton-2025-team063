import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    redirects() {
        return [{source: "/", destination: "/dashboard", statusCode: 302}];
    }
};

export default nextConfig;
