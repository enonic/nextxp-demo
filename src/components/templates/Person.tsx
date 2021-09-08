import React from "react"
import Link from "next/link";
import {Person} from "../../shared/data/queries/getPerson";

import {getFirstPhotoData} from "../../shared/images";


const PersonPage = (person: Person) => {
    const personMeta = person.data || {};
    const personFirstPhoto = getFirstPhotoData(personMeta.photos);
    return (
        <>
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline'
                }}>
                    <h2>{person.displayName}</h2>
                </div>
                <div style={{
                    display: `flex`
                }}>
                    {
                        personFirstPhoto &&
                        <img style={{maxWidth: '400px', width: '50%'}}
                             src={personFirstPhoto.imageUrl}
                             title={person.displayName}/>
                    }
                    <p style={{
                        margin: `0 20px`
                    }}><i>{personMeta.bio}</i></p>
                </div>
            </div>
            <p>
                <a href='../persons'>Back to Persons</a>
            </p>
        </>
    )
}

export default PersonPage
