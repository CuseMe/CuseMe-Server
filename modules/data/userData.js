module.exports = 
(rawUserData) => {
    userData = {
        "userIdx": rawUserData.userIdx,
        "uuid": rawUserData.uuid,
        "password": rawUserData.password,
        "salt": rawUserData.salt,
        "phoneNum": rawUserData.phoneNum
    }
    return userData;
}