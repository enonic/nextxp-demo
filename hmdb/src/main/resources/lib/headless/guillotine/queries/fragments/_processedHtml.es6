/* TODO: This adds to the query in ./_components, for processing HTML in htmlareas.
       Same as in _components, macros from this XP app need to be added here, along the same rules.
       For example, a macro 'button-blue' has a textfield 'text' and 'url', then add this inside the 'config' block:
           button_blue {
                text
                url
            }

 */

const macrosFragment = `
    name
    ref
    config {
    }
`;

const processedHtmlFragment = `(processHtml:{type:server}) {
        processedHtml
        macros {
            ${macrosFragment}
        }
    }
`;

module.exports = { processedHtmlFragment };
