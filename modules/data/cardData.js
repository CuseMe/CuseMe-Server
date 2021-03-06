module.exports = 
    (rawCardData) => {
        cardData = {
            "cardIdx": rawCardData.cardIdx,
            "title": rawCardData.title,
            "content": rawCardData.content,
            "image": rawCardData.image,
            "record": rawCardData.record,
            "count": rawCardData.count,
            "visible": rawCardData.visible == 1 ? true : false,
            "serialNum": rawCardData.serialNum,
            "sequence": rawCardData.sequence,
        }
        return cardData
    }
