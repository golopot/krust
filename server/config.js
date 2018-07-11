require('dotenv').config({path: '../.env'})

module.exports = {
  hostname: process.env.hostname,
  port: process.env.port,
  protocol: process.env.protocol,
  mongourl: process.env.mongourl,
  appsecret: process.env.appsecret,
  oauth_id_google: process.env.oauth_id_google,
  oauth_secret_google: process.env.oauth_secret_google,
}
