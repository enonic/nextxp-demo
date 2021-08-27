const graphQlLib = require('/lib/graphql');
const { runInBranchContext } = require('../../branch-context');

// TODO: delve into. Generalize!
const schema = require('../schema/schema');

const guillotineQuery = (query, params, branch = 'master') => {
    const queryResponse = runInBranchContext(
        () => graphQlLib.execute(schema, query, params),
        branch
    );

    const { data, errors } = queryResponse;

    if (errors) {
        log.error(`GraphQL errors for ${JSON.stringify(params)}:`);
        errors.forEach((error) => log.error(error.message));
        // TODO: throw error?
    }

    return data?.guillotine;
};

module.exports = { guillotineQuery /*, guillotineSchema: schema*/ };
