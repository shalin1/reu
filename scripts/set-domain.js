const fs = require('fs')

// Environment variables provided by Netlify
const deployUrl = process.env.DEPLOY_PRIME_URL
const context = process.env.CONTEXT

console.log('BOOGA')
console.log(deployUrl)

// default ot existing env var
let clientDomain = process.env.VITE_CLIENT_DOMAIN

if (context === 'deploy-preview') {
  clientDomain = deployUrl
}

// Write the environment variable to a file that can be included in the build
const content = `VITE_CLIENT_DOMAIN=${clientDomain}\n`
fs.appendFileSync('./.env.production', content)