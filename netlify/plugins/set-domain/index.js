module.exports = {
  onPreBuild: ({ utils, constants }) => {
    if (constants.CONTEXT === 'deploy-preview') {
      const deployUrl = constants.DEPLOY_PRIME_URL
      process.env.CLIENT_DOMAIN = deployUrl
      process.env.VITE_CLIENT_DOMAIN = deployUrl
    }
  },
}
