import {queryGuillotine} from '@enonic/nextjs-adapter';

const getTwoColumnLayout = queryGuillotine(`getSite {
      displayName
      type
    }`);

export default getTwoColumnLayout;
