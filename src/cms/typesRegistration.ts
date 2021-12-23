import {TypesRegistry} from '../enonicAdapter/TypesRegistry';

import {XP_COMPONENT_TYPE} from '../enonicAdapter/enonic-connection-config';

import BasePart from '../enonicAdapter/views/_BasePart';
import BaseLayout from '../enonicAdapter/views/_BaseLayout';
import ImageView from './components/_Image';
import TextView from './components/_Text';

import FolderView, {folderQuery, FOLDER_CONTENTTYPE_NAME} from "./contentTypes/Folder";

import MovieView, {movieQuery, MOVIE_CONTENTTYPE_NAME}  from "./contentTypes/Movie";

import PersonView, {personQuery, PERSON_CONTENTTYPE_NAME} from "./contentTypes/Person";



import ThreeColumnLayoutView, {THREE_COL_LAYOUT_NAME} from './layouts/ThreeColumnLayout';
import CenteredLayoutView, {CENTERED_LAYOUT_NAME} from './layouts/CenteredLayout';
import DefaultLayoutView from './layouts/_Layout';

import HeadingView, {HEADING_PART_NAME} from "./parts/Heading";
import ChildListView, {CHILDLIST_PART_NAME} from './parts/ChildList';


/*
*       Content Types
*
* */


TypesRegistry.addContentType(FOLDER_CONTENTTYPE_NAME, {
    query: folderQuery,
    view: FolderView,
});


TypesRegistry.addContentType(PERSON_CONTENTTYPE_NAME, {
    query: personQuery,
    view: PersonView,
});

TypesRegistry.addContentType(MOVIE_CONTENTTYPE_NAME, {
    query: movieQuery,
    view: MovieView,
});




/*
*       Component Types
* */

TypesRegistry.addComponent(XP_COMPONENT_TYPE.PART, {
    // query: TODO: allow override queries (which would affect all image components) to be added here? If so, should they mutate the first (meta) or the second one?
    // props: TODO: same,
    view: BasePart
});

TypesRegistry.addComponent(XP_COMPONENT_TYPE.LAYOUT, {
    view: BaseLayout
});

TypesRegistry.addComponent(XP_COMPONENT_TYPE.IMAGE, {
    view: ImageView
});

TypesRegistry.addComponent(XP_COMPONENT_TYPE.TEXT, {
    view: TextView
});


/*
*       Part Types
* */

TypesRegistry.addPart(CHILDLIST_PART_NAME, {
    view: ChildListView,
})
TypesRegistry.addPart(HEADING_PART_NAME, {
    view: HeadingView,
})

/*
*       Layout Types
* */

TypesRegistry.addLayout(THREE_COL_LAYOUT_NAME, {
    view: ThreeColumnLayoutView
});

TypesRegistry.addLayout(CENTERED_LAYOUT_NAME, {
    view: CenteredLayoutView
});

TypesRegistry.addLayout("*", {
    view: DefaultLayoutView
});
