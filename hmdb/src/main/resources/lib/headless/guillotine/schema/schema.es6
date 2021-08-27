const guillotineLib = require('/lib/guillotine');
const genericLib = require('/lib/guillotine/generic');
const dynamicLib = require('/lib/guillotine/dynamic');
const rootQueryLib = require('/lib/guillotine/query/root-query');
const rootSubscriptionLib = require('/lib/guillotine/subscription/root-subscription');


const schemaContextOptions = {
    creationCallbacks: {
        // ADD SPECIFYING OR EXPANDING SCHEMA FOR CONTENT TYPES ETC, FOR EXAMPLE:
        // my_example_app_MyContentType: (context, params) => {
        //      params.fields.newHelloField = {
        //          type: libGraphQl.GraphQLString,
        //          resolve: function (env) {
        //              return "Hello";
        //          }
        //      };
    },

    // applications: [app.name, LIST TO INCLUDE OTHER EXTERNAL APPS BY NAME ],
};

const initAndCreateSchema = () => {
    const context = guillotineLib.createContext(schemaContextOptions);
    genericLib.createTypes(context);
    dynamicLib.createTypes(context);
    return context.schemaGenerator.createSchema({
        query: rootQueryLib.createRootQueryType(context),
        subscription: rootSubscriptionLib.createRootSubscriptionType(context),
        dictionary: context.dictionary,
    });
};

const schema = initAndCreateSchema();

module.exports = schema;
