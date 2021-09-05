import React from "react"
import Link from "next/link";
import { Person } from "../../shared/data/queries/getPerson";

import { getPhoto} from "../../shared/images";


const PersonPage = (person: Person) => {
    const personMeta = person.data || {};
    const personPhoto = getPhoto(personMeta.photos);
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
                        personPhoto &&
                        <img style={{ maxWidth: '400px', width: '50%' }}
                               src={personPhoto.imageUrl}
                               title={person.displayName}
                               alt={personPhoto.alt} />
                    }
                    <p style={{
                        margin: `0 20px`
                    }}><i>{personMeta.bio}</i></p>
                </div>
            </div>
            <p>
                <Link href={`.`}>
                    <a>Back to Persons</a>
                </Link>
            </p>
        </>
    )
}

export default PersonPage
