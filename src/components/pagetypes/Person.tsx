import React from "react"
import {Person} from "../../shared/data/queries/getPerson";

import styles from "../../styles/Home.module.css";

import Link from 'next/link'

import {getFirstPhotoData} from "../../shared/images/images";
import {getPageUrlFromXpPath} from "../../enonic-connection-config";


const PersonPage = (person: Person) => {
    console.log("\n\nPerson props:", person);

    const personMeta = person.data || {};
    const personFirstPhoto = getFirstPhotoData(personMeta.photos);
    console.log("-personFirstPhoto:", personFirstPhoto);

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
                <a href={getPageUrlFromXpPath(person.parent._path)}>Directly back to Persons</a>
            </p>
            <p>
                <Link href={`${getPageUrlFromXpPath(person.parent._path)}/keanu-reeves`}><a>Keanu hardcoded via Link</a></Link>
            </p>
            <p>
                <Link href='persons'><a>Back to Persons via hardcode</a></Link>
            </p>
            <br />

            <p>
                <a href='www.aftenposten.no'>Aftenposten direkte www</a>
            </p>
            <p>
                <a href='https://www.aftenposten.no'>Aftenposten direkte full</a>
            </p>
            <br />

            <p>
                <Link href='www.aftenposten.no'><a>Aftenposten Link www</a></Link>
            </p>
            <p>
                <Link href='https://www.aftenposten.no'><a>Aftenposten Link full</a></Link>
            </p>
        </>
    )
}

export default PersonPage
