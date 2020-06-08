const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

     if(!authHeader)
        return res.status(401).send({ error: 'No token provided'});

    //formato do token
    //Bearer afdafnjdksabd4fas468
    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token error' });

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)) //Aula 2: 19:00
        return res.status(401).send({ error: 'Token malformatted' });

    
    jwt.verify(token, authConfig.secret, (err, decoded)=> {
        if(err) 
            return res.status(401).send({ error: 'Token invalid' });

        req.userId = decoded.id;
        return next();
    });
};