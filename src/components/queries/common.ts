import {queryGuillotineWithPath} from '@enonic/nextjs-adapter';

// This query is executed for every page rendering.
// Result is included in props.common

export const commonQuery = queryGuillotineWithPath(`get(key:$path) {
      displayName
      _id
      type
      dataAsJson
      xAsJson
    }
    getSite {
      displayName
      pageUrl
  }`);

