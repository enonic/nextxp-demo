import React from "react"
import {Person} from "../../shared/data/queries/getPerson";

import styles from "../../styles/Home.module.css";

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
                        // @ts-ignore
                        personFirstPhoto && personFirstPhoto.imageUrl &&
                        <>
                            <img src={personFirstPhoto.imageUrl}
                                 alt={person.displayName}
                                 className={styles.mainPhoto}/>
                        </>
                    }
                    <p style={{
                        margin: `0 20px`
                    }}><i>{personMeta.bio}</i></p>
                </div>
            </div>
            <p>
                <a href='..'>Back to Persons</a>
            </p>
        </>
    )
}

export default PersonPage
