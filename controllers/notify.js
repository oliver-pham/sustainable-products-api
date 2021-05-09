var courier = require("@trycourier/courier").CourierClient({ authorizationToken: "pk_prod_W78CCX8V2WMGCEKAN5D7APAE4C0S" });

async function notify(recipientId, data) {
    var { messageId } = await courier.send({
        eventId: "courier-quickstart",
        recipientId: recipientId,
        data: data,
    });

    console.log(messageId);
    
}

module.exports = notify;