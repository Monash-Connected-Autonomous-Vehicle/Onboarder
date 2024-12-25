// For local deployment
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// Refer to: https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    middlewareMode: false,
    open: false, // Don't open browser on start
  },
  optimizeDeps: {
    // Exclude these dependencies from the build, as they sometimes cause errors
    exclude: [
      "chunk-ZDDMMNEZ",
      "chunk-2KUE3VNV",
      "chunk-ZBE5NY6T",
      "chunk-252QOTLA",
      "chunk-2MTVQD3K",
      "chunk-PD3ESFWK",
      "chunk-IJP62PDK",
      "chunk-H4IPINZR",
      "chunk-CTCWNMGS",
      "chunk-KYX6SBIZ",
      "chunk-LV2ZWRNG",
      "chunk-WVCO3IUI",
      "chunk-E4JF2IAF",
      "chunk-S2GGM3ZX",
      "chunk-7IROGDA5",
      "chunk-FQSLNRCO",
      "chunk-TRXLE6LY",
      "chunk-Z3TPAJXH",
      "chunk-VQ5LTCL7",
      "chunk-QMRCDMAY",
      "chunk-Z76SMOEW",
      "chunk-TRU7UCIC",
    ],
  },
});

// // For prod
// import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";
// export default {
//   // config options
//   server: {
//     host: true,
//     port: 80,
//   },
//   plugins: [react(), svgr()],
// };
