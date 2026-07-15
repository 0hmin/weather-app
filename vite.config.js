import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

      "/kma-apihub": {
        target: "https://apihub.kma.go.kr",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(
            /^\/kma-apihub/,
            "/api/typ02/openApi/VilageFcstInfoService_2.0",
          ),
      },

      "/kma-data": {
        target: "https://apis.data.go.kr",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/kma-data/, "/1360000/VilageFcstInfoService_2.0"),
      },
    },
  },
});
