import FreshserviceHelper from "./freshserviceHelper.js";

const freshserviceHelper = new FreshserviceHelper();

freshserviceHelper.getTicket(295572)
    .then((ticket) => {
        console.log(ticket);
    })
    .catch((error) => {
        console.error(error);
    });
