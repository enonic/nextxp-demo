import React from "react"
import Image from "next/image";
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

                        <div className={`${styles.photoContainer} ${styles.mainPhoto}`}>
                            <Image src={personFirstPhoto.imageUrl}
                                   alt={person.displayName}
                                   width={500}
                                   height={500/personFirstPhoto.aspect} />
                        </div>
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
