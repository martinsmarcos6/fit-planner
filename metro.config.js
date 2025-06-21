const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);
 
// Adiciona suporte ao Expo Router
config.resolver.sourceExts.push('mjs');
 
module.exports = withNativeWind(config, { input: "./global.css" });