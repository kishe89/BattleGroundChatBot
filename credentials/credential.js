/**
 * CreatedAt 2017-11-16 14:25:00 kst by kim ji woon
 */

module.exports = {
    MongodbURI:"mongodb://adminkim:adminkim@ds125060.mlab.com:25060/chatbot",
    RedisURI:"",
    ObjectStorage:{
        provider: 'openstack',
        useServiceCatalog: true,
        useInternal: false,
        keystoneAuthVersion: 'v3',
        authUrl: 'https://identity.open.softlayer.com',
        tenantId: 'your project Id',    //projectId from credentials
        domainId: 'your domainId',
        domainName: 'your domainName',
        username: 'your userName',
        password: 'your password',
        region: 'your region'   //dallas or london region
    }
};
