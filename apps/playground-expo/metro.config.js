const { getDefaultConfig } = require('expo/metro-config');

// Expo's default config already watches the pnpm workspace root and resolves
// workspace packages (such as @alanwind/native) through node_modules.
module.exports = getDefaultConfig(__dirname);
