// TODO: this is lightweight data from a content (-selector) reference. What about a more thorough data fetch? Add dataAsJson? xAsJson?


const globalFragment = `
    __typename
    _id
    _path
    createdTime
    modifiedTime
    displayName
    language
    publish {
        first
        from
    }
`;

module.exports = globalFragment;
