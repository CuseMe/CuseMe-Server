module.exports = 
    (rawtrackingData) => {
        trackingData = {
            "trackIdx": rawtrackingData.trackIdx,
            "createTime": rawtrackingData.createTime,
            "updateTime": rawtrackingData.updateTime,
            "userIdx": rawtrackingData.userIdx,
            "cardIdx": rawtrackingData.cardIdx
        }
        return trackingData
    }
