import React from 'react'
import {FetchContentResult} from '@enonic/nextjs-adapter';
import {getUrl} from '@enonic/nextjs-adapter/UrlProcessor';

const Person = (props: FetchContentResult) => {
    const {displayName, data, parent} = props.data?.get as any;
    const {bio, photos} = data;
    const meta = props.meta;
    const {_path} = parent;

    return (
        <>
            <div>
                <h2>{displayName}</h2>
                <p>{bio}</p>
                {
                    photos.map((photo: any, i: number) => (
                        <img key={i}
                             src={photo.imageUrl}
                             title={
                                 (photo.attachments || [])[0].name ||
                                 displayName
                             }
                             width="500"
                        />
                    ))
                }
            </div>
            <p><a href={getUrl(_path, meta)}>Back to Persons</a></p>
        </>
    )
}

export default Person;
