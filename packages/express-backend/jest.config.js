export default {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.env.js"],
  testTimeout: 30000,
  transform: {}, // needed when using ESM and experimental-vm-modules
};
