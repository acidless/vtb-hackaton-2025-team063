import {version} from "./package.json";

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

export default withPWA({
    reactCompiler: true,
    redirects() {
        return [{source: "/", destination: "/register", statusCode: 302}];
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: version,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://fambank.ru:8000",
        NEXT_PUBLIC_MOCK_BASE_URL: process.env.NEXT_PUBLIC_MOCK_BASE_URL || "http://localhost:3000",
    },
});
