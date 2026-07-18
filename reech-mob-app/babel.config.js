module.exports = function (api) {
  api.cache(true);
  return {
    presets: [ "babel-preset-expo", "module:metro-react-native-babel-preset"],
    plugins: [
      "nativewind/babel",
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        "module-resolver", 
        {
            root: ["."],
            alias: {
                "@/assets": "./assets",
                "@/components": "./components",
                "@/screens": "./screens",
                "@/navigation": "./navigation",
                "@/constants": "./constants",
                "@/redux": "./redux",
                "@/utils": "./utils"
            }
        }
    ]
    ],
  };
};
