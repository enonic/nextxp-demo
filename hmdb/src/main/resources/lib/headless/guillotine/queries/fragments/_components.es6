/* TODO: This builds a query for fetching components data (for XP-WYSIWYG-built structures).
    -   For each component in this XP app,
        under each '${appNameUnderscored}' in the appropriate section (parts, layouts, pages),
        add a block for the component. Dashes become underscores.
        E.g., for a part called my-part, add this under partsFragment, inside the block config { ${appNameUnderscored} {
            my_part {
            }
    -   Then, list the names for the input types that are found in the component definition XML, inside the component's block.
        E.g., if my-part has a textfield called 'sometext', an imageselector called 'animage', a htmlarea called 'somehtml', a contentselector 'othercontent', an item-set (with sub-items) called 'deeper', and an option-set called 'options':
            my_part {
                sometext
                animage
                somehtml
                othercontent
                deeper
                options
            }
    -   For every item-set input, add a new sub-block and list the sub-items the same way. Repeat for deeper nested levels.
        E.g., if the 'deeper' item-set has a textfield 'moretext' and an item-set 'nestThis' below it, which in turn has a textfield 'bottom':
            my_part {
                ...
                deeper {
                    moretext
                    nestThis {
                        bottom
                    }
                }
                ...
            }
    -   Option-sets are similar to item-sets, but need a '_selected' sub-item.
        Option items below that have no nested inputs of their own, don't need to be listed.
        Option items that do have nested inputs, should be listed along with a block with the inputs below them.
        E.g., the 'options' input has a selectable 'default' option (with no input items below it), and a 'other' option.
        The 'other' option has a radiobutton input: 'choices'.
            my_part {
                ...
                options {
                    _selected
                    option {
                        choices
                    }
                }
            }
    -   ImageSelectors need a sub-block with ${imageFragment} imported from ./media:
            my_part {
                ...
                animage {
                    ${imageFragment}
                }
                ...
            }
    -   Likewise, HtmlAreas need a sub-block with ${processedHtmlFragment} imported from ./processedHtml.
        NOTE: read about macros in .processedHtml:
            my_part {
                ...
                somehtml {
                    ${processedHtmlFragment}
                }
                ...
            }
    -   Contentselectors can fetch superficial metadata by adding a sub-block with ${globalFragment} from ./_global:
            my_part {
                ...
                othercontent {
                    ${globalFragment}
                }
                ...
            }
    -   For deeper fetch through contentselectors: use the '...on' syntax described in ../sitecontent, e.g.:
            my_part {
                ...on my_app_ContentType {
                    _id
                    _name
                    data {
                        datafield1
                        datafield2
                        etc
                    }
                }
            }
    -   Inputs from mixins are added directly to each component that use them, by adding their input names in the component's main block.
        (Recommended: split these out in an importable fragment for each mixin, same as imageFragment above)
        E.g., my-part uses a mixing 'my-mixin', which supplies two textfields named 'foo' and 'bar':
            my_part {
                sometext
                animage {
                    ...
                }
                somehtml {
                    ...
                }
                deeper {
                    ...
                }
                options {
                    ...
                }
                foo
                bar
            }
 */

// TODO: see '<AND MORE?>' above: are some sub-structure level types skipped?

// TODO: it should be possible to auto-generate this instead of adding it manually as described above?

                                                                                                                        /*
                                                                                                                        const {
                                                                                                                            linkWithIngressMixinFragment,
                                                                                                                            linkSelectableMixin,
                                                                                                                            pageNavigationMenuMixinFragment,
                                                                                                                            headerCommonMixin,
                                                                                                                        } = require('./_mixins');
                                                                                                                        */

const { imageFragment } = require('./_media');
const { processedHtmlFragment } = require('./_processedHtml');
const globalFragment = require('./_global');

                                                                                                                        // TODO: What's this do?
                                                                                                                        // const contentListMixinFragment = require('./dangerous-mixins/content-list-mixin');


// TODO: Generalize more? Single-source?
const appNameUnderscored = app.name.replace(/\./g, '_');


const partsFragment = `
    config {
        ${appNameUnderscored} {` +
                                                                                                                        /*
                                                                                                                        EXAMPLE.
                                                                                                                        dynamic_link_panel {
                                                                                                                            ${linkWithIngressMixinFragment}
                                                                                                                            icon {
                                                                                                                                ${imageFragment}
                                                                                                                            }
                                                                                                                            background {
                                                                                                                                ${imageFragment}
                                                                                                                            }
                                                                                                                        }
                                                                                                                        dynamic_supervisor_panel {
                                                                                                                            content ${processedHtmlFragment}
                                                                                                                            margin
                                                                                                                        }
                                                                                                                        */
        +
        `}
    }
`;

const layoutsFragment = `
    config {
        ${appNameUnderscored} {
            section_with_header {
                anchorId
                icon {
                    color
                    size
                    icon {
                        ${imageFragment}
                    }
                }
            }
        }
    }
`;

const pagesFragment = `
    config {
        ${appNameUnderscored} {
            page_with_side_menus {
               ${pageNavigationMenuMixinFragment}
            }
        }
    }
`;

const componentsContent = `
    type
    path
    page {
        descriptor
        configAsJson
        ${pagesFragment}
    }
    layout {
        descriptor
        configAsJson
        ${layoutsFragment}
    }
    part {
        descriptor
        configAsJson
        ${partsFragment}
    }
    image {
        image {
            imageUrl(scale: "$scale", type: server)
        }
    }
`;
// TODO: only image? Not text? Or fragments?

// We have to resolve and handle fragments ourselves, as the structure generated by
// using resolveFragment: true crashes the content studio editor...
// ("fragment" is an overloaded term here, the "fragment" fields inside this query-fragment
// refers to the fragment component type)
const componentsFragment = `
    components(resolveTemplate: true, resolveFragment: false) {
        ${componentsContent}
        fragment {
            fragment {
                components(resolveTemplate: true, resolveFragment: false){
                    ${componentsContent}
                }
            }
        }
    }
`;

module.exports = componentsFragment;
