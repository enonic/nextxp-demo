import React from "react"

import {APP_NAME, APP_NAME_UNDERSCORED, getContentLinkUrlFromXpPath} from '../../enonicAdapter/enonic-connection-config'

// fully qualified XP content-type name:
export const PERSON_CONTENTTYPE_NAME = `${APP_NAME}:person`;


export const personQuery = `
query($path:ID!){
  guillotine {
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
        displayName
        _path                                                         
      }
    }
  }
}`;


const Person = ({content}) => {
    const {displayName, data={}, parent={}} = content;
    const {bio, photos} = data;

    return (
        <>
            <div>
                <h2>{displayName}</h2>

                <p>{bio}</p>

                {
                    photos.map((photo, i) => (
                        <img key={i}
                             src={photo.imageUrl}
                             title={
                                 (photo.attachments || [])[0].name ||
                                 displayName
                             }
                             width="200"
                        />
                    ))
                }
            </div>

            <p><a href={getContentLinkUrlFromXpPath(parent._path)}>
                Back to {parent.displayName}
            </a></p>
        </>
    )
}

export default Person;
