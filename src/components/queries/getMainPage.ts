import {queryGuillotine} from '@enonic/nextjs-adapter';

const getMainPage = queryGuillotine(`getSite {
      displayName
    }`);

export default getMainPage;
