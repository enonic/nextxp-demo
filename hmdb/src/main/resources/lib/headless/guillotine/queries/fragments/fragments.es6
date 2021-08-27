const globalFragment = require('./_global');
const componentsFragment = require('./_components');
const media = require('./_media');

/* TODO: import query fragments here from /content-types, for content types in this XP app.
        Each one should be shaped as strings like this:
        -   Starting the block: ...on app_name_underscored_ContentTypeUpperCasedWithoutHyphens {
            E.g., the content type 'my-content-type' in the XP app named 'com.example.my.app':
                ...on com_example_my_app_MyContentType {
        - The rest of the block filled out with metafields at the root and input-item fields from the descriptor XML below a 'data' block, along the rules described in fragments/_components.
            E.g., if my-content-type.xml defines two textfields 'firstfield' and 'secondfield' under <form>:
                ...on com_example_my_app_MyContentType {
                    _id
                    _name
                    displayName
                    data {
                        firstfield
                        secondfield
                    }
                }
 */

// For example
// const sectionPage = require('./fragments/sectionPage');

// TODO: Auto-generate the above instead of creating them manually?


const queryFragments = [
    globalFragment,
    componentsFragment,
    media.mediaAttachmentFragment,

    // ...and for example:
    // sectionPage.fragment
].join('\n');




export const queryGeneralByRef = `query($ref:ID!){
guillotine {
    get(key:$ref) {
            displayName
            _id
            _name
            _path
            type
            dataAsJson
            xAsJson
            pageAsJson(resolveTemplate: true, resolveFragment: false)
            ...on base_Folder {
                children(first:100) {
                    ${queryFragments}
                }
            }
        }
    }
}`

export const queryGetContentByRef = `query($ref:ID!){
    guillotine {
        get(key:$ref) {
            ${queryFragments}
            pageAsJson(resolveTemplate: true, resolveFragment: false)
            ...on base_Folder {
                children(first:1000) {
                    ${queryFragments}
                }
            }
        }
    }
}`;

log.info("queryGetContentByRef (" +
    (Array.isArray(queryGetContentByRef) ?
            ("array[" + queryGetContentByRef.length + "]") :
            (typeof queryGetContentByRef + (queryGetContentByRef && typeof queryGetContentByRef === 'object' ? (" with keys: " + JSON.stringify(Object.keys(queryGetContentByRef))) : ""))
    ) + "): " + JSON.stringify(queryGetContentByRef, null, 2)
);
