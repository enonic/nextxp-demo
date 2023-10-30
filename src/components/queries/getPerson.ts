import {APP_NAME_UNDERSCORED} from '@enonic/nextjs-adapter';

const getPerson = `query($path:ID!, $repo: String, $siteKey: String, $branch: String) {
  guillotine(siteKey: $siteKey, repo: $repo, branch: $branch) {
    get(key:$path) {
      displayName
      ... on ${APP_NAME_UNDERSCORED}_Person {
        data {
          bio
          dateofbirth
          photos {
           ... on media_Image {                                             
              imageUrl: imageUrl(type: absolute, scale: "width(500)")       
              attachments {                                                 
                name
              }
            }
          }
        }
      }
      parent {
        pageUrl                                                        
      }
    }
  }
}`;

export default getPerson;
