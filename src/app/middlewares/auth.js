const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json')
require('dotenv').config(); 

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
    return res.status(401).send({error: 'no token provided'});

        const parts = authHeader.split(' ');
        
    if (!parts.length === 2)
    return res.status(401).send({error: 'token error'}); 

        const [schema, token] = parts;

    if (!/^bearer$/i.test(schema))
     return res.status(401).send({error: 'token malformatted'});

     jwt.verify(token, authConfig.secret, (err, decoded) => { 
         if(err) return res.status(401).send({error: 'token ivalid'});
         
         req.userId = decoded.id;

         return next();
     });
}