const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const {secretOrPrivateKey} = require('../config/secretKey');
const options = {
    //algorithm: "HS256",
    //expiresIn: "1m",
    //issuer: "haely"
};

module.exports = {
    //토큰 생성
    sign: (user) => {
        const payload = {
            idx: user.idx
        };
        const result = {
            //json값인 payload. jwt.sign을 쓰면 토큰이 하나 만들어짐!
            token: jwt.sign(payload, secretOrPrivateKey, options),
            refreshToken: randToken.uid(256)
        };
        return result;
    },
    //토큰 검증
    verify: (token) => {
        let decoded;
        try{
            decoded = jwt.verify(token, secretOrPrivateKey);
        } catch(err){
            if(err.message === 'jwt expired'){
                console.log('expired token');
                return -3;
            } else if(err.message === 'invalid token'){
                console.log('invalid token');
                return -2;
            } else{
                console.log('other problem');
                return -2;
            }
        }
        return decoded;
<<<<<<< HEAD
    },
    refresh: (user) => {
        const payload = {
            idx: user.idx
        };
        return jwt.sign(payload, secretOrPrivateKey, options);
=======
>>>>>>> 4114d11cd60886e4673c2b8dc9e2fb14b9c38c38
    }
};