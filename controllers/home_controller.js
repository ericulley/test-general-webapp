// Dependencies
const express = require('express');
const home = express.Router()
const axios = require('axios').default
require('dotenv').config
const { requiresAuth } = require('express-openid-connect')
const ManagementClient = require('auth0').ManagementClient

const DOMAIN = process.env.AUTH0_DOMAIN
const C_DOMAIN = process.env.AUTH0_C_DOMAIN
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET

let loginAT 

// Routes
home.get('/', (req, res) => {
    console.log("``````````````````````````````````")
    console.log("ID Token: ", req.oidc.idTokenClaims)
    console.log("Access Token", req.oidc.accessToken)
    console.log("Refresh Token: ", req.oidc.refreshToken)
    loginAT = req.oidc.accessToken
    if(req.oidc) {
        res.render('index.ejs', {
            userInfo: req.oidc.user,
            isAuthenticated: req.oidc.isAuthenticated(),
            idToken: req.oidc.idTokenClaims,
        })
    } else {
        res.render('index.ejs', {
            userInfo: null,
            isAuthenticated: null,
            idToken: null,
        })
    }
})

home.get('/login', (req, res) => {
    console.log("/login route started")
    if (req.query.connection) {
        console.log("CONNECTION=", req.query.connection);
        return res.oidc.login({
            connection: req.query.connection
        })
    }
    if (req.query.organization) {
        const {
        organization,
        organization_name,
        invitation,
        } = req.query
    }
    return res.oidc.login({
        returnTo: 'http://localhost:4000',
        authorizationParams: {
            // organization: "org_cVrNdGU2SoPSvZoT"
        }
    })
})

// home.get('/logout', (req, res) => {
//     return res.oidc.logout({
//         // federated: true
//     })
// })

home.get('/refresh_token', (req, res) => {
    console.log("REFRESH TOKEN, LINE 60: ", req.oidc.refreshToken)
    axios.post(`https://${C_DOMAIN}/oauth/token`, {
        grant_type: 'refresh_token',
        client_id: `${CLIENT_ID}`,
        client_secret: `${CLIENT_SECRET}`,
        refresh_token: `${req.oidc.refreshToken}`
    }).then((data) => {
        console.log("REFRESH TOKEN RESPONSE: ", data.data)
        if (data.data) {
            console.log("DATA: ", data.data);
            // res.send(`Current Tokens: ${JSON.stringify(data)}`)
        }
        res.send(`New Tokens: ${JSON.stringify(data.data)}`)
    }).catch((err) => {
        console.log(err.message)
        res.redirect('/logout')
    })
    // res.send(`Current Tokens: ${JSON.stringify(data)}`);
})

home.get('/refresh', async (req, res) => {
    // let { access_token, isExpired, refresh } = req.oidc.accessToken;
    // if (isExpired()) {
    //   ({ access_token } = await refresh({scope: 'openid email profile offline_access read:message role:admin'}));
    // }
    let { access_token, isExpired, refresh } = req.oidc.accessToken;
    if (isExpired()) {
        ({ access_token } = await refresh());
    }
    res.send([req.oidc.accessToken, req.oidc.refreshToken])
})

home.get('/callback', (req, res) => {
    console.log("CALLBACK ROUTE: ", req.params)
    if (req.params.error === 'login_required') {
        res.oidc.login({
            authorizationParams: {
                scope: 'openid email profile offline_access read:message role:admin'
            }
        })
    }
})
 
home.get('/error', (req, res) => {
    res.send("Error: Please verify your email before logging ing. Thank you.")
})

home.get('/requires-auth', requiresAuth(), async (req, res) => {
    res.send("!!!This page requires authorization because it stores super secret info!!!")
    // try {
    //     axios.get(`http://localhost:8080/auth`, {
    //         headers: {'authorization': `${req.oidc.accessToken.token_type} ${req.oidc.accessToken.access_token}`}
    //     }).then((res) => {
    //         console.log("RESPONSE: ", res.data)
    //         res.send(res.data) 
    //     })
    // } catch (err) {
    //     console.log(err) 
    // }

    let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
    if (isExpired()) {
        // ({ access_token } = await refresh());
    }
    console.log("Access Token: ", access_token)
    console.log("ID Token: ", req.oidc.idToken)
    
})

home.get('/userinfo', requiresAuth(), (req, res) => {
    console.log("/userinfo: ", req.oidc.accessToken.access_token)
      
    axios.get(`https://${C_DOMAIN}/userinfo`, {
        headers: {'authorization': `${req.oidc.accessToken.token_type} ${req.oidc.accessToken.access_token}`}
    }).then((res) => {
        console.log("RESPONSE: ", res.data)
    }).catch((err) => {
        // console.log(err)
    })

    res.send("!!!!CHECK CONSOLE FOR RESPONSE!!!!")
})

home.get('/mgmt-api', requiresAuth(), async (req, res) => {
    const token = {}
    // let options = {
    //     method: 'POST',
    //     url: `https://${DOMAIN}/oauth/token`,
    //     headers: {'content-type': 'application/json'},
    //     data: {
    //       grant_type: 'client_credentials',
    //       client_id: `${CLIENT_ID}`,
    //       client_secret: `${CLIENT_SECRET}`,
    //       audience: `https://${DOMAIN}/api/v2/`
    //     }
    //   };
      
    //   axios.request(options).then((res) => {
    //         console.log(res.data)
    //     }).catch((error) => {
    //     console.log("ERRRRORRRR: ", error);
    //   });

 
    await axios.post(`https://${DOMAIN}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: `${CLIENT_ID}`,
        client_secret: `${CLIENT_SECRET}`,
        audience: `https://${DOMAIN}/api/v2/`
    }, {
        headers: {
            'content-type': 'application/json', 
        }
    }).then((res) => {
        console.log(res.data)
        token.value = res.data.access_token
        token.type = res.data.token_type
    }).catch((err) => {
        console.error(err.message)
    })


    axios.get(`https://${DOMAIN}/api/v2/users`, {
        headers: {
            Authorization: `${token.type} ${token.value}`,
        }
    }).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err.message)
    })
    res.send("!!!Check Console to Confirm Response!!!")
})

home.get('/init-login', (req, res) => {
    console.log(req.query.connection);

    return res.oidc.login({
        returnTo: 'http://localhost:4000',
        authorizationParams: {
            connection: req.query.connection
        }
    })
})

// Export Router
module.exports = home