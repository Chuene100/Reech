const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname, {
    isCSSEnabled: true,
});

defaultConfig.resolver.assetExts.push('db');

module.exports = defaultConfig;