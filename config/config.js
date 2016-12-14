module.exports = {
  db : 'mongodb://root:admin@ds035806.mlab.com:35806/node_ecommerce',
  port: 1338,
  secretKey: 'audia  4  002  00$$',
  facebook : {
    clientID : process.env.FACEBOOK_ID || 1606442996325321,
    clientSecret: process.env.FACEBOOK_SECRET || '8542090af6ab3f3b2a2c4fe73f1c7fd9',
    ProfileFields : ['email', 'displayName'],
    callbackURL : 'http://localhost:1337/auth/facebook/callback'
  },

  google : {
      clientID: '96057516219-ju52t3dk3g2kdlh5duaghob0ea9jpdcc.apps.googleusercontent.com',
      clientSecret: '173aHVxZnjlT2HPtT9r6neUa',
      callbackURL: "http://localhost:1337/auth/google/callback"
    }
}
