// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3, { resolve as resolve3 } from "path";

// utils/plugins/make-manifest.ts
import * as fs from "fs";
import * as path from "path";

// utils/log.ts
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
  }
  console.log(color, message);
}
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m"
};

// utils/manifest-parser/index.ts
var ManifestParser = class {
  constructor() {
  }
  static convertManifestToString(manifest2) {
    return JSON.stringify(manifest2, null, 2);
  }
};
var manifest_parser_default = ManifestParser;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname = "/Users/k.htet/Code/surprise-me/utils/plugins";
var { resolve } = path;
var distDir = resolve(__vite_injected_original_dirname, "..", "..", "dist");
var publicDir = resolve(__vite_injected_original_dirname, "..", "..", "public");
function makeManifest(manifest2, config) {
  function makeManifest2(to) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, "manifest.json");
    if (config.contentScriptCssKey) {
      manifest2.content_scripts.forEach((script) => {
        script.css = script.css.map(
          (css) => css.replace("<KEY>", config.contentScriptCssKey)
        );
      });
    }
    fs.writeFileSync(
      manifestPath,
      manifest_parser_default.convertManifestToString(manifest2)
    );
    colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
  }
  return {
    name: "make-manifest",
    buildStart() {
      if (config.isDev) {
        makeManifest2(distDir);
      }
    },
    buildEnd() {
      if (config.isDev) {
        return;
      }
      makeManifest2(publicDir);
    }
  };
}

// utils/plugins/custom-dynamic-import.ts
function customDynamicImport() {
  return {
    name: "custom-dynamic-import",
    renderDynamicImport() {
      return {
        left: `
        {
          const dynamicImport = (path) => import(path);
          dynamicImport(
          `,
        right: ")}"
      };
    }
  };
}

// utils/plugins/add-hmr.ts
import * as path2 from "path";
import { readFileSync } from "fs";
var __vite_injected_original_dirname2 = "/Users/k.htet/Code/surprise-me/utils/plugins";
var isDev = process.env.__DEV__ === "true";
var DUMMY_CODE = `export default function(){};`;
function getInjectionCode(fileName) {
  return readFileSync(
    path2.resolve(__vite_injected_original_dirname2, "..", "reload", "injections", fileName),
    { encoding: "utf8" }
  );
}
function addHmr(config) {
  const { background = false, view = true } = config || {};
  const idInBackgroundScript = "virtual:reload-on-update-in-background-script";
  const idInView = "virtual:reload-on-update-in-view";
  const scriptHmrCode = isDev ? getInjectionCode("script.js") : DUMMY_CODE;
  const viewHmrCode = isDev ? getInjectionCode("view.js") : DUMMY_CODE;
  return {
    name: "add-hmr",
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }
      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    }
  };
}
function getResolvedId(id) {
  return "\0" + id;
}

// package.json
var package_default = {
  name: "surprise-me",
  version: "0.0.1",
  description: "Surprise Me",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/khzaw/surprise-0me"
  },
  scripts: {
    build: "tsc --noEmit && vite build",
    "build:watch": "cross-env __DEV__=true vite build --watch",
    "build:hmr": "rollup --config utils/reload/rollup.config.ts",
    wss: "node utils/reload/initReloadServer.js",
    dev: "npm run build:hmr && (run-p wss build:watch)",
    test: "jest"
  },
  type: "module",
  dependencies: {
    "@deliveryhero/armor": "^1.117.1",
    "@deliveryhero/armor-icons": "^1.29.1",
    "@deliveryhero/armor-motion": "^1.3.7",
    "@deliveryhero/pd-bento-design-tokens": "1.13.2",
    "@deliveryhero/pd-cookbook": "23.14.3",
    lodash: "^4.17.21",
    react: "18.2.0",
    "react-dom": "18.2.0",
    "styled-components": "^5.3.9"
  },
  devDependencies: {
    "@rollup/plugin-typescript": "^8.5.0",
    "@testing-library/react": "13.4.0",
    "@types/chrome": "0.0.224",
    "@types/jest": "29.0.3",
    "@types/node": "18.15.11",
    "@types/react": "18.0.21",
    "@types/react-dom": "18.0.11",
    "@types/ws": "^8.5.3",
    "@typescript-eslint/eslint-plugin": "5.56.0",
    "@typescript-eslint/parser": "5.38.1",
    "@vitejs/plugin-react": "2.2.0",
    chokidar: "^3.5.3",
    "cross-env": "^7.0.3",
    eslint: "8.36.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "4.2.1",
    "eslint-plugin-react": "7.32.2",
    "fs-extra": "11.1.0",
    jest: "29.0.3",
    "jest-environment-jsdom": "29.5.0",
    "npm-run-all": "^4.1.5",
    prettier: "2.7.1",
    rollup: "2.79.1",
    sass: "1.55.0",
    "ts-jest": "29.0.2",
    "ts-loader": "9.4.2",
    typescript: "4.8.3",
    vite: "3.1.3",
    ws: "8.9.0"
  }
};

// manifest.ts
var manifest = {
  manifest_version: 3,
  name: package_default.name,
  version: package_default.version,
  description: package_default.description,
  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png"
  },
  icons: {
    "128": "icon-128.png"
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      css: ["assets/css/contentStyle<KEY>.chunk.css"]
    }
  ],
  permissions: [
    "webRequest",
    "tabs"
  ],
  host_permissions: [
    "https://www-st.foodpanda.sg/*",
    "https://www.foodpanda.sg/*",
    "https://sg-st.fd-api.com/*",
    "https://sg.fd-api.com/*"
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png"
      ],
      matches: ["*://*/*"]
    }
  ]
};
var manifest_default = manifest;

// vite.config.ts
var __vite_injected_original_dirname3 = "/Users/k.htet/Code/surprise-me";
var root = resolve3(__vite_injected_original_dirname3, "src");
var pagesDir = resolve3(root, "pages");
var assetsDir = resolve3(root, "assets");
var outDir = resolve3(__vite_injected_original_dirname3, "dist");
var publicDir2 = resolve3(__vite_injected_original_dirname3, "public");
var isDev2 = process.env.__DEV__ === "true";
var isProduction = !isDev2;
var enableHmrInBackgroundScript = true;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir
    }
  },
  define: {
    global: {}
  },
  plugins: [
    react(),
    makeManifest(manifest_default, {
      isDev: isDev2,
      contentScriptCssKey: regenerateCacheInvalidationKey()
    }),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true })
  ],
  publicDir: publicDir2,
  build: {
    outDir,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      input: {
        devtools: resolve3(pagesDir, "devtools", "index.html"),
        panel: resolve3(pagesDir, "panel", "index.html"),
        content: resolve3(pagesDir, "content", "index.ts"),
        background: resolve3(pagesDir, "background", "index.ts"),
        contentStyle: resolve3(pagesDir, "content", "style.scss"),
        popup: resolve3(pagesDir, "popup", "index.html"),
        newtab: resolve3(pagesDir, "newtab", "index.html"),
        options: resolve3(pagesDir, "options", "index.html")
      },
      watch: {
        include: ["src/**", "vite.config.ts"],
        exclude: ["node_modules/**", "src/**/*.spec.ts"]
      },
      output: {
        entryFileNames: "src/pages/[name]/index.js",
        chunkFileNames: isDev2 ? "assets/js/[name].js" : "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = path3.parse(assetInfo.name);
          const assetFolder = dir.split("/").at(-1);
          const name = assetFolder + firstUpperCase(_name);
          if (name === "contentStyle") {
            return `assets/css/contentStyle${cacheInvalidationKey}.chunk.css`;
          }
          return `assets/[ext]/${name}.chunk.[ext]`;
        }
      }
    }
  }
});
function firstUpperCase(str) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}
var cacheInvalidationKey = generateKey();
function regenerateCacheInvalidationKey() {
  cacheInvalidationKey = generateKey();
  return cacheInvalidationKey;
}
function generateKey() {
  return `${(Date.now() / 100).toFixed()}`;
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzIiwgInV0aWxzL2xvZy50cyIsICJ1dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHMiLCAidXRpbHMvcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnQudHMiLCAidXRpbHMvcGx1Z2lucy9hZGQtaG1yLnRzIiwgIm1hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2suaHRldC9Db2RlL3N1cnByaXNlLW1lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvay5odGV0L0NvZGUvc3VycHJpc2UtbWUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2suaHRldC9Db2RlL3N1cnByaXNlLW1lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IG1ha2VNYW5pZmVzdCBmcm9tIFwiLi91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3RcIjtcbmltcG9ydCBjdXN0b21EeW5hbWljSW1wb3J0IGZyb20gXCIuL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0XCI7XG5pbXBvcnQgYWRkSG1yIGZyb20gXCIuL3V0aWxzL3BsdWdpbnMvYWRkLWhtclwiO1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0XCI7XG5cbmNvbnN0IHJvb3QgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIik7XG5jb25zdCBwYWdlc0RpciA9IHJlc29sdmUocm9vdCwgXCJwYWdlc1wiKTtcbmNvbnN0IGFzc2V0c0RpciA9IHJlc29sdmUocm9vdCwgXCJhc3NldHNcIik7XG5jb25zdCBvdXREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJkaXN0XCIpO1xuY29uc3QgcHVibGljRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwicHVibGljXCIpO1xuXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Ll9fREVWX18gPT09IFwidHJ1ZVwiO1xuY29uc3QgaXNQcm9kdWN0aW9uID0gIWlzRGV2O1xuXG4vLyBFTkFCTEUgSE1SIElOIEJBQ0tHUk9VTkQgU0NSSVBUXG5jb25zdCBlbmFibGVIbXJJbkJhY2tncm91bmRTY3JpcHQgPSB0cnVlO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIFwiQHNyY1wiOiByb290LFxuICAgICAgICAgICAgXCJAYXNzZXRzXCI6IGFzc2V0c0RpcixcbiAgICAgICAgICAgIFwiQHBhZ2VzXCI6IHBhZ2VzRGlyLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAgIC8vIFNvbWUgbGlicmFyaWVzIHVzZSB0aGUgZ2xvYmFsIG9iamVjdCwgZXZlbiB0aG91Z2ggaXQgZG9lc24ndCBleGlzdCBpbiB0aGUgYnJvd3Nlci5cbiAgICAgICAgLy8gQWx0ZXJuYXRpdmVseSwgd2UgY291bGQgYWRkIGA8c2NyaXB0PndpbmRvdy5nbG9iYWwgPSB3aW5kb3c7PC9zY3JpcHQ+YCB0byBpbmRleC5odG1sLlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvZGlzY3Vzc2lvbnMvNTkxMlxuICAgICAgICBnbG9iYWw6IHt9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgICByZWFjdCgpLFxuICAgICAgICBtYWtlTWFuaWZlc3QobWFuaWZlc3QsIHtcbiAgICAgICAgICAgIGlzRGV2LFxuICAgICAgICAgICAgY29udGVudFNjcmlwdENzc0tleTogcmVnZW5lcmF0ZUNhY2hlSW52YWxpZGF0aW9uS2V5KCksXG4gICAgICAgIH0pLFxuICAgICAgICBjdXN0b21EeW5hbWljSW1wb3J0KCksXG4gICAgICAgIGFkZEhtcih7IGJhY2tncm91bmQ6IGVuYWJsZUhtckluQmFja2dyb3VuZFNjcmlwdCwgdmlldzogdHJ1ZSB9KSxcbiAgICBdLFxuICAgIHB1YmxpY0RpcixcbiAgICBidWlsZDoge1xuICAgICAgICBvdXREaXIsXG4gICAgICAgIC8qKiBDYW4gc2xvd0Rvd24gYnVpbGQgc3BlZWQuICovXG4gICAgICAgIC8vIHNvdXJjZW1hcDogaXNEZXYsXG4gICAgICAgIG1pbmlmeTogaXNQcm9kdWN0aW9uLFxuICAgICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogaXNQcm9kdWN0aW9uLFxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgICAgIGRldnRvb2xzOiByZXNvbHZlKHBhZ2VzRGlyLCBcImRldnRvb2xzXCIsIFwiaW5kZXguaHRtbFwiKSxcbiAgICAgICAgICAgICAgICBwYW5lbDogcmVzb2x2ZShwYWdlc0RpciwgXCJwYW5lbFwiLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgICAgICAgICAgY29udGVudDogcmVzb2x2ZShwYWdlc0RpciwgXCJjb250ZW50XCIsIFwiaW5kZXgudHNcIiksXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcmVzb2x2ZShwYWdlc0RpciwgXCJiYWNrZ3JvdW5kXCIsIFwiaW5kZXgudHNcIiksXG4gICAgICAgICAgICAgICAgY29udGVudFN0eWxlOiByZXNvbHZlKHBhZ2VzRGlyLCBcImNvbnRlbnRcIiwgXCJzdHlsZS5zY3NzXCIpLFxuICAgICAgICAgICAgICAgIHBvcHVwOiByZXNvbHZlKHBhZ2VzRGlyLCBcInBvcHVwXCIsIFwiaW5kZXguaHRtbFwiKSxcbiAgICAgICAgICAgICAgICBuZXd0YWI6IHJlc29sdmUocGFnZXNEaXIsIFwibmV3dGFiXCIsIFwiaW5kZXguaHRtbFwiKSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiByZXNvbHZlKHBhZ2VzRGlyLCBcIm9wdGlvbnNcIiwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICAgICAgaW5jbHVkZTogW1wic3JjLyoqXCIsIFwidml0ZS5jb25maWcudHNcIl0sXG4gICAgICAgICAgICAgICAgZXhjbHVkZTogW1wibm9kZV9tb2R1bGVzLyoqXCIsIFwic3JjLyoqLyouc3BlYy50c1wiXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJzcmMvcGFnZXMvW25hbWVdL2luZGV4LmpzXCIsXG4gICAgICAgICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGlzRGV2XG4gICAgICAgICAgICAgICAgICAgID8gXCJhc3NldHMvanMvW25hbWVdLmpzXCJcbiAgICAgICAgICAgICAgICAgICAgOiBcImFzc2V0cy9qcy9bbmFtZV0uW2hhc2hdLmpzXCIsXG4gICAgICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBkaXIsIG5hbWU6IF9uYW1lIH0gPSBwYXRoLnBhcnNlKGFzc2V0SW5mby5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzZXRGb2xkZXIgPSBkaXIuc3BsaXQoXCIvXCIpLmF0KC0xKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGFzc2V0Rm9sZGVyICsgZmlyc3RVcHBlckNhc2UoX25hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJjb250ZW50U3R5bGVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBhc3NldHMvY3NzL2NvbnRlbnRTdHlsZSR7Y2FjaGVJbnZhbGlkYXRpb25LZXl9LmNodW5rLmNzc2A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBhc3NldHMvW2V4dF0vJHtuYW1lfS5jaHVuay5bZXh0XWA7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuXG5mdW5jdGlvbiBmaXJzdFVwcGVyQ2FzZShzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IGZpcnN0QWxwaGFiZXQgPSBuZXcgUmVnRXhwKC8oIHxeKVthLXpdLywgXCJnXCIpO1xuICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGZpcnN0QWxwaGFiZXQsIChMKSA9PiBMLnRvVXBwZXJDYXNlKCkpO1xufVxuXG5sZXQgY2FjaGVJbnZhbGlkYXRpb25LZXk6IHN0cmluZyA9IGdlbmVyYXRlS2V5KCk7XG5mdW5jdGlvbiByZWdlbmVyYXRlQ2FjaGVJbnZhbGlkYXRpb25LZXkoKSB7XG4gICAgY2FjaGVJbnZhbGlkYXRpb25LZXkgPSBnZW5lcmF0ZUtleSgpO1xuICAgIHJldHVybiBjYWNoZUludmFsaWRhdGlvbktleTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7KERhdGUubm93KCkgLyAxMDApLnRvRml4ZWQoKX1gO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvay5odGV0L0NvZGUvc3VycHJpc2UtbWUvdXRpbHMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2suaHRldC9Db2RlL3N1cnByaXNlLW1lL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvay5odGV0L0NvZGUvc3VycHJpc2UtbWUvdXRpbHMvcGx1Z2lucy9tYWtlLW1hbmlmZXN0LnRzXCI7aW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgY29sb3JMb2cgZnJvbSBcIi4uL2xvZ1wiO1xuaW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBNYW5pZmVzdFBhcnNlciBmcm9tIFwiLi4vbWFuaWZlc3QtcGFyc2VyXCI7XG5cbmNvbnN0IHsgcmVzb2x2ZSB9ID0gcGF0aDtcblxuY29uc3QgZGlzdERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCJkaXN0XCIpO1xuY29uc3QgcHVibGljRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi5cIiwgXCIuLlwiLCBcInB1YmxpY1wiKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZU1hbmlmZXN0KFxuICBtYW5pZmVzdDogY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMyxcbiAgY29uZmlnOiB7IGlzRGV2OiBib29sZWFuOyBjb250ZW50U2NyaXB0Q3NzS2V5Pzogc3RyaW5nIH1cbik6IFBsdWdpbk9wdGlvbiB7XG4gIGZ1bmN0aW9uIG1ha2VNYW5pZmVzdCh0bzogc3RyaW5nKSB7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHRvKSkge1xuICAgICAgZnMubWtkaXJTeW5jKHRvKTtcbiAgICB9XG4gICAgY29uc3QgbWFuaWZlc3RQYXRoID0gcmVzb2x2ZSh0bywgXCJtYW5pZmVzdC5qc29uXCIpO1xuXG4gICAgLy8gTmFtaW5nIGNoYW5nZSBmb3IgY2FjaGUgaW52YWxpZGF0aW9uXG4gICAgaWYgKGNvbmZpZy5jb250ZW50U2NyaXB0Q3NzS2V5KSB7XG4gICAgICBtYW5pZmVzdC5jb250ZW50X3NjcmlwdHMuZm9yRWFjaCgoc2NyaXB0KSA9PiB7XG4gICAgICAgIHNjcmlwdC5jc3MgPSBzY3JpcHQuY3NzLm1hcCgoY3NzKSA9PlxuICAgICAgICAgIGNzcy5yZXBsYWNlKFwiPEtFWT5cIiwgY29uZmlnLmNvbnRlbnRTY3JpcHRDc3NLZXkpXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmcy53cml0ZUZpbGVTeW5jKFxuICAgICAgbWFuaWZlc3RQYXRoLFxuICAgICAgTWFuaWZlc3RQYXJzZXIuY29udmVydE1hbmlmZXN0VG9TdHJpbmcobWFuaWZlc3QpXG4gICAgKTtcblxuICAgIGNvbG9yTG9nKGBNYW5pZmVzdCBmaWxlIGNvcHkgY29tcGxldGU6ICR7bWFuaWZlc3RQYXRofWAsIFwic3VjY2Vzc1wiKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJtYWtlLW1hbmlmZXN0XCIsXG4gICAgYnVpbGRTdGFydCgpIHtcbiAgICAgIGlmIChjb25maWcuaXNEZXYpIHtcbiAgICAgICAgbWFrZU1hbmlmZXN0KGRpc3REaXIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYnVpbGRFbmQoKSB7XG4gICAgICBpZiAoY29uZmlnLmlzRGV2KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1ha2VNYW5pZmVzdChwdWJsaWNEaXIpO1xuICAgIH0sXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9rLmh0ZXQvQ29kZS9zdXJwcmlzZS1tZS91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2suaHRldC9Db2RlL3N1cnByaXNlLW1lL3V0aWxzL2xvZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvay5odGV0L0NvZGUvc3VycHJpc2UtbWUvdXRpbHMvbG9nLnRzXCI7dHlwZSBDb2xvclR5cGUgPSBcInN1Y2Nlc3NcIiB8IFwiaW5mb1wiIHwgXCJlcnJvclwiIHwgXCJ3YXJuaW5nXCIgfCBrZXlvZiB0eXBlb2YgQ09MT1JTO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvckxvZyhtZXNzYWdlOiBzdHJpbmcsIHR5cGU/OiBDb2xvclR5cGUpIHtcbiAgbGV0IGNvbG9yOiBzdHJpbmcgPSB0eXBlIHx8IENPTE9SUy5GZ0JsYWNrO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJzdWNjZXNzXCI6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ0dyZWVuO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImluZm9cIjpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnQmx1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdSZWQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwid2FybmluZ1wiOlxuICAgICAgY29sb3IgPSBDT0xPUlMuRmdZZWxsb3c7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGNvbG9yLCBtZXNzYWdlKTtcbn1cblxuY29uc3QgQ09MT1JTID0ge1xuICBSZXNldDogXCJcXHgxYlswbVwiLFxuICBCcmlnaHQ6IFwiXFx4MWJbMW1cIixcbiAgRGltOiBcIlxceDFiWzJtXCIsXG4gIFVuZGVyc2NvcmU6IFwiXFx4MWJbNG1cIixcbiAgQmxpbms6IFwiXFx4MWJbNW1cIixcbiAgUmV2ZXJzZTogXCJcXHgxYls3bVwiLFxuICBIaWRkZW46IFwiXFx4MWJbOG1cIixcbiAgRmdCbGFjazogXCJcXHgxYlszMG1cIixcbiAgRmdSZWQ6IFwiXFx4MWJbMzFtXCIsXG4gIEZnR3JlZW46IFwiXFx4MWJbMzJtXCIsXG4gIEZnWWVsbG93OiBcIlxceDFiWzMzbVwiLFxuICBGZ0JsdWU6IFwiXFx4MWJbMzRtXCIsXG4gIEZnTWFnZW50YTogXCJcXHgxYlszNW1cIixcbiAgRmdDeWFuOiBcIlxceDFiWzM2bVwiLFxuICBGZ1doaXRlOiBcIlxceDFiWzM3bVwiLFxuICBCZ0JsYWNrOiBcIlxceDFiWzQwbVwiLFxuICBCZ1JlZDogXCJcXHgxYls0MW1cIixcbiAgQmdHcmVlbjogXCJcXHgxYls0Mm1cIixcbiAgQmdZZWxsb3c6IFwiXFx4MWJbNDNtXCIsXG4gIEJnQmx1ZTogXCJcXHgxYls0NG1cIixcbiAgQmdNYWdlbnRhOiBcIlxceDFiWzQ1bVwiLFxuICBCZ0N5YW46IFwiXFx4MWJbNDZtXCIsXG4gIEJnV2hpdGU6IFwiXFx4MWJbNDdtXCIsXG59IGFzIGNvbnN0O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvay5odGV0L0NvZGUvc3VycHJpc2UtbWUvdXRpbHMvbWFuaWZlc3QtcGFyc2VyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvay5odGV0L0NvZGUvc3VycHJpc2UtbWUvdXRpbHMvbWFuaWZlc3QtcGFyc2VyL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9rLmh0ZXQvQ29kZS9zdXJwcmlzZS1tZS91dGlscy9tYW5pZmVzdC1wYXJzZXIvaW5kZXgudHNcIjt0eXBlIE1hbmlmZXN0ID0gY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMztcblxuY2xhc3MgTWFuaWZlc3RQYXJzZXIge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuXG4gIHN0YXRpYyBjb252ZXJ0TWFuaWZlc3RUb1N0cmluZyhtYW5pZmVzdDogTWFuaWZlc3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCwgbnVsbCwgMik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFuaWZlc3RQYXJzZXI7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9rLmh0ZXQvQ29kZS9zdXJwcmlzZS1tZS91dGlscy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvay5odGV0L0NvZGUvc3VycHJpc2UtbWUvdXRpbHMvcGx1Z2lucy9jdXN0b20tZHluYW1pYy1pbXBvcnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2suaHRldC9Db2RlL3N1cnByaXNlLW1lL3V0aWxzL3BsdWdpbnMvY3VzdG9tLWR5bmFtaWMtaW1wb3J0LnRzXCI7aW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3VzdG9tRHluYW1pY0ltcG9ydCgpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiY3VzdG9tLWR5bmFtaWMtaW1wb3J0XCIsXG4gICAgcmVuZGVyRHluYW1pY0ltcG9ydCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IGBcbiAgICAgICAge1xuICAgICAgICAgIGNvbnN0IGR5bmFtaWNJbXBvcnQgPSAocGF0aCkgPT4gaW1wb3J0KHBhdGgpO1xuICAgICAgICAgIGR5bmFtaWNJbXBvcnQoXG4gICAgICAgICAgYCxcbiAgICAgICAgcmlnaHQ6IFwiKX1cIixcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2suaHRldC9Db2RlL3N1cnByaXNlLW1lL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9rLmh0ZXQvQ29kZS9zdXJwcmlzZS1tZS91dGlscy9wbHVnaW5zL2FkZC1obXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2suaHRldC9Db2RlL3N1cnByaXNlLW1lL3V0aWxzL3BsdWdpbnMvYWRkLWhtci50c1wiO2ltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcblxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIjtcblxuY29uc3QgRFVNTVlfQ09ERSA9IGBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe307YDtcblxuZnVuY3Rpb24gZ2V0SW5qZWN0aW9uQ29kZShmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJlYWRGaWxlU3luYyhcbiAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwicmVsb2FkXCIsIFwiaW5qZWN0aW9uc1wiLCBmaWxlTmFtZSksXG4gICAgeyBlbmNvZGluZzogXCJ1dGY4XCIgfVxuICApO1xufVxuXG50eXBlIENvbmZpZyA9IHtcbiAgYmFja2dyb3VuZD86IGJvb2xlYW47XG4gIHZpZXc/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkSG1yKGNvbmZpZz86IENvbmZpZyk6IFBsdWdpbk9wdGlvbiB7XG4gIGNvbnN0IHsgYmFja2dyb3VuZCA9IGZhbHNlLCB2aWV3ID0gdHJ1ZSB9ID0gY29uZmlnIHx8IHt9O1xuICBjb25zdCBpZEluQmFja2dyb3VuZFNjcmlwdCA9IFwidmlydHVhbDpyZWxvYWQtb24tdXBkYXRlLWluLWJhY2tncm91bmQtc2NyaXB0XCI7XG4gIGNvbnN0IGlkSW5WaWV3ID0gXCJ2aXJ0dWFsOnJlbG9hZC1vbi11cGRhdGUtaW4tdmlld1wiO1xuXG4gIGNvbnN0IHNjcmlwdEhtckNvZGUgPSBpc0RldiA/IGdldEluamVjdGlvbkNvZGUoXCJzY3JpcHQuanNcIikgOiBEVU1NWV9DT0RFO1xuICBjb25zdCB2aWV3SG1yQ29kZSA9IGlzRGV2ID8gZ2V0SW5qZWN0aW9uQ29kZShcInZpZXcuanNcIikgOiBEVU1NWV9DT0RFO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJhZGQtaG1yXCIsXG4gICAgcmVzb2x2ZUlkKGlkKSB7XG4gICAgICBpZiAoaWQgPT09IGlkSW5CYWNrZ3JvdW5kU2NyaXB0IHx8IGlkID09PSBpZEluVmlldykge1xuICAgICAgICByZXR1cm4gZ2V0UmVzb2x2ZWRJZChpZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBsb2FkKGlkKSB7XG4gICAgICBpZiAoaWQgPT09IGdldFJlc29sdmVkSWQoaWRJbkJhY2tncm91bmRTY3JpcHQpKSB7XG4gICAgICAgIHJldHVybiBiYWNrZ3JvdW5kID8gc2NyaXB0SG1yQ29kZSA6IERVTU1ZX0NPREU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpZCA9PT0gZ2V0UmVzb2x2ZWRJZChpZEluVmlldykpIHtcbiAgICAgICAgcmV0dXJuIHZpZXcgPyB2aWV3SG1yQ29kZSA6IERVTU1ZX0NPREU7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVzb2x2ZWRJZChpZDogc3RyaW5nKSB7XG4gIHJldHVybiBcIlxcMFwiICsgaWQ7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9rLmh0ZXQvQ29kZS9zdXJwcmlzZS1tZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2suaHRldC9Db2RlL3N1cnByaXNlLW1lL21hbmlmZXN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9rLmh0ZXQvQ29kZS9zdXJwcmlzZS1tZS9tYW5pZmVzdC50c1wiO2ltcG9ydCBwYWNrYWdlSnNvbiBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcblxuLyoqXG4gKiBBZnRlciBjaGFuZ2luZywgcGxlYXNlIHJlbG9hZCB0aGUgZXh0ZW5zaW9uIGF0IGBjaHJvbWU6Ly9leHRlbnNpb25zYFxuICovXG5jb25zdCBtYW5pZmVzdDogY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMyA9IHtcblx0bWFuaWZlc3RfdmVyc2lvbjogMyxcblx0bmFtZTogcGFja2FnZUpzb24ubmFtZSxcblx0dmVyc2lvbjogcGFja2FnZUpzb24udmVyc2lvbixcblx0ZGVzY3JpcHRpb246IHBhY2thZ2VKc29uLmRlc2NyaXB0aW9uLFxuXHRvcHRpb25zX3BhZ2U6IFwic3JjL3BhZ2VzL29wdGlvbnMvaW5kZXguaHRtbFwiLFxuXHRiYWNrZ3JvdW5kOiB7XG5cdFx0c2VydmljZV93b3JrZXI6IFwic3JjL3BhZ2VzL2JhY2tncm91bmQvaW5kZXguanNcIixcblx0XHR0eXBlOiBcIm1vZHVsZVwiLFxuXHR9LFxuXHRhY3Rpb246IHtcblx0XHRkZWZhdWx0X3BvcHVwOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCIsXG5cdFx0ZGVmYXVsdF9pY29uOiBcImljb24tMzQucG5nXCIsXG5cdH0sXG5cdGljb25zOiB7XG5cdFx0XCIxMjhcIjogXCJpY29uLTEyOC5wbmdcIixcblx0fSxcblx0Y29udGVudF9zY3JpcHRzOiBbXG5cdFx0e1xuXHRcdFx0bWF0Y2hlczogW1wiaHR0cDovLyovKlwiLCBcImh0dHBzOi8vKi8qXCIsIFwiPGFsbF91cmxzPlwiXSxcblx0XHRcdGpzOiBbXCJzcmMvcGFnZXMvY29udGVudC9pbmRleC5qc1wiXSxcblx0XHRcdC8vIEtFWSBmb3IgY2FjaGUgaW52YWxpZGF0aW9uXG5cdFx0XHRjc3M6IFtcImFzc2V0cy9jc3MvY29udGVudFN0eWxlPEtFWT4uY2h1bmsuY3NzXCJdLFxuXHRcdH0sXG5cdF0sXG5cdHBlcm1pc3Npb25zOiBbXG5cdFx0XCJ3ZWJSZXF1ZXN0XCIsXG5cdFx0XCJ0YWJzXCJcblx0XSxcblx0aG9zdF9wZXJtaXNzaW9uczogW1xuXHRcdFwiaHR0cHM6Ly93d3ctc3QuZm9vZHBhbmRhLnNnLypcIixcblx0XHRcImh0dHBzOi8vd3d3LmZvb2RwYW5kYS5zZy8qXCIsXG5cdFx0XCJodHRwczovL3NnLXN0LmZkLWFwaS5jb20vKlwiLFxuXHRcdFwiaHR0cHM6Ly9zZy5mZC1hcGkuY29tLypcIlxuXHRdLFxuXHRkZXZ0b29sc19wYWdlOiBcInNyYy9wYWdlcy9kZXZ0b29scy9pbmRleC5odG1sXCIsXG5cdHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW1xuXHRcdHtcblx0XHRcdHJlc291cmNlczogW1xuXHRcdFx0XHRcImFzc2V0cy9qcy8qLmpzXCIsXG5cdFx0XHRcdFwiYXNzZXRzL2Nzcy8qLmNzc1wiLFxuXHRcdFx0XHRcImljb24tMTI4LnBuZ1wiLFxuXHRcdFx0XHRcImljb24tMzQucG5nXCIsXG5cdFx0XHRdLFxuXHRcdFx0bWF0Y2hlczogW1wiKjovLyovKlwiXSxcblx0XHR9LFxuXHRdLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFuaWZlc3Q7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRRLFNBQVMsb0JBQW9CO0FBQ3pTLE9BQU8sV0FBVztBQUNsQixPQUFPQSxTQUFRLFdBQUFDLGdCQUFlOzs7QUNGNFIsWUFBWSxRQUFRO0FBQzlVLFlBQVksVUFBVTs7O0FDQ1AsU0FBUixTQUEwQixTQUFpQixNQUFrQjtBQUNsRSxNQUFJLFFBQWdCLFFBQVEsT0FBTztBQUVuQyxVQUFRLE1BQU07QUFBQSxJQUNaLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLElBQ0YsS0FBSztBQUNILGNBQVEsT0FBTztBQUNmO0FBQUEsSUFDRixLQUFLO0FBQ0gsY0FBUSxPQUFPO0FBQ2Y7QUFBQSxJQUNGLEtBQUs7QUFDSCxjQUFRLE9BQU87QUFDZjtBQUFBLEVBQ0o7QUFFQSxVQUFRLElBQUksT0FBTyxPQUFPO0FBQzVCO0FBRUEs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QSxJQUN0QixlQUFlO0FBQUEsTUFDWCxPQUFPO0FBQUEsUUFDSCxVQUFVRixTQUFRLFVBQVUsWUFBWSxZQUFZO0FBQUEsUUFDcEQsT0FBT0EsU0FBUSxVQUFVLFNBQVMsWUFBWTtBQUFBLFFBQzlDLFNBQVNBLFNBQVEsVUFBVSxXQUFXLFVBQVU7QUFBQSxRQUNoRCxZQUFZQSxTQUFRLFVBQVUsY0FBYyxVQUFVO0FBQUEsUUFDdEQsY0FBY0EsU0FBUSxVQUFVLFdBQVcsWUFBWTtBQUFBLFFBQ3ZELE9BQU9BLFNBQVEsVUFBVSxTQUFTLFlBQVk7QUFBQSxRQUM5QyxRQUFRQSxTQUFRLFVBQVUsVUFBVSxZQUFZO0FBQUEsUUFDaEQsU0FBU0EsU0FBUSxVQUFVLFdBQVcsWUFBWTtBQUFBLE1BQ3REO0FBQUEsTUFDQSxPQUFPO0FBQUEsUUFDSCxTQUFTLENBQUMsVUFBVSxnQkFBZ0I7QUFBQSxRQUNwQyxTQUFTLENBQUMsbUJBQW1CLGtCQUFrQjtBQUFBLE1BQ25EO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDSixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0JHLFNBQ1Ysd0JBQ0E7QUFBQSxRQUNOLGdCQUFnQixDQUFDLGNBQWM7QUFDM0IsZ0JBQU0sRUFBRSxLQUFLLE1BQU0sTUFBTSxJQUFJQyxNQUFLLE1BQU0sVUFBVSxJQUFJO0FBQ3RELGdCQUFNLGNBQWMsSUFBSSxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDeEMsZ0JBQU0sT0FBTyxjQUFjLGVBQWUsS0FBSztBQUMvQyxjQUFJLFNBQVMsZ0JBQWdCO0FBQ3pCLG1CQUFPLDBCQUEwQjtBQUFBLFVBQ3JDO0FBQ0EsaUJBQU8sZ0JBQWdCO0FBQUEsUUFDM0I7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDO0FBRUQsU0FBUyxlQUFlLEtBQWE7QUFDakMsUUFBTSxnQkFBZ0IsSUFBSSxPQUFPLGNBQWMsR0FBRztBQUNsRCxTQUFPLElBQUksWUFBWSxFQUFFLFFBQVEsZUFBZSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7QUFDMUU7QUFFQSxJQUFJLHVCQUErQixZQUFZO0FBQy9DLFNBQVMsaUNBQWlDO0FBQ3RDLHlCQUF1QixZQUFZO0FBQ25DLFNBQU87QUFDWDtBQUVBLFNBQVMsY0FBc0I7QUFDM0IsU0FBTyxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssUUFBUTtBQUN6QzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJyZXNvbHZlIiwgIm1hbmlmZXN0IiwgIm1hbmlmZXN0IiwgIm1ha2VNYW5pZmVzdCIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicHVibGljRGlyIiwgImlzRGV2IiwgInBhdGgiXQp9Cg==
