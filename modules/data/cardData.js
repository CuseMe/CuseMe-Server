module.exports = 
    (rawCardData) => {
        cardData = {
            "cardIdx": rawCardData.cardIdx,
            "title": rawCardData.title,
            "content": rawCardData.content,
            "image": rawCardData.image,
            "record": rawCardData.record,
            "count": rawCardData.count,
            "visible": rawCardData.visible,
            "serialNum": rawCardData.serialNum,
            "userIdx": rawCardData.userIdx,
        }
        return cardData
    }