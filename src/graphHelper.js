const axios = require('axios');
const { PublicClientApplication } = require('@azure/msal-node');

class MicrosoftGraphAPI {

    constructor(appId, appKey, tenantId) {
        this.appId=appId;
        this.appKey=appKey;
        this.tenantId=tenantId;
        this.credential = new ClientSecretCredential(this.tenantId, this.appId, this.appKey);
        const scopes = [
            "https://graph.microsoft.com/.default"
        ];
        const options = { scopes };
        this.authProvider = new TokenCredentialAuthenticationProvider(this.credential, options);

        this.client = Client.initWithMiddleware({
            debugLogging: false,
            authProvider: this.authProvider
        });
    }

    /**
     * Get the number of active users for a given month, by day, by application
     * https://learn.microsoft.com/en-us/graph/api/reportroot-getoffice365activeusercounts?view=graph-rest-1.0&tabs=javascript
     * @param {*} month - The month to get active users for
     * @returns Promise that resolves to the number of active users
     */
    async getActiveUsers(month) {
        // This return the url to a csv that contains usage data
        const csv = await this.client.api(`/reports/getOffice365ActiveUserCounts(period='D30')`).get();
        axios.get(csv.location, {responseType: 'stream'}).then((response) => {
            console.log(response);
        });
    }

    /**
     * Get Licensing details for tenant currently
     * https://learn.microsoft.com/en-us/graph/api/directory-list-subscriptions?view=graph-rest-1.0&tabs=javascript
     * @returns Map containing key alue pairs of (License name, [totalLicenses, consumedLicenses]) (perhaps, unscertain how to obtain consumed number)
     */
    async getLicensingDetails() {
        const subscriptions = await this.client.api(`/directory/subscriptions`).get();
        const licensingDetails = new Map();
        for (const subscription of subscriptions) {
            licensingDetails.set(subscription.skuPartNumber, [subscription.totalLicenses, 0/*subscription.consumedLicenses*/]);
        }
        return licensingDetails;
    }
}

module.exports = MicrosoftGraphAPI;