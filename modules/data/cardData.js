module.exports = 
    (rawCardData) => {
        cardData = {
            "cardIdx": rawCardData.cardIdx,
            "title": rawCardData.title,
            "content": rawCardData.content,
            "record": rawCardData.record,
            "count": rawCardData.count,
            "visible": rawCardData.visible,
            "serialNum": rawCardData.serialNum,
            "userIdx": rawCardData.userIdx,
        }
        return cardData
    }
