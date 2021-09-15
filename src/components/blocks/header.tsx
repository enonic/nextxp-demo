import React, {FunctionComponent, useEffect, useState} from "react"

import Link from "next/link";
import Image from "next/image";

import xpShield from '../../public/images/xp-shield.svg';

type HeaderProps = {
    siteTitle?: string
    random: number
}

export const fetchRandom = async() => {
    const options = {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };

    try {
        const res = await fetch('http://localhost:3000/api/random', options);
        const json = await res.json();
        return json.value;

    } catch (e) {
        console.error(e);
        return -1
    }
}

const Header: FunctionComponent<HeaderProps> = ({ siteTitle, random }: HeaderProps) => {
    const [count, setCount] = useState(0);
    const [rand, setRandom] = useState(0);

    useEffect(() => {
        const updateRandom = async () => {
            const rnd = await fetchRandom();
            setRandom(() => rnd)
        };

        setInterval(()=>{
            updateRandom();
        },
            2000)
    }, [])

    return (
        <header
            onClick={() => setCount(prev => prev+1)}
            style={{
                background: `rebeccapurple`,
                marginBottom: `1.45rem`,
            }}
        >
            <div
                style={{
                    margin: `0 auto`,
                    maxWidth: 960,
                    padding: `1.45rem 1.0875rem`,
                    display: `flex`,
                    justifyContent: 'space-between'
                }}
            >
                <h1 style={{margin: 0}}>
                    <Link
                        href="/">
                        <a style={{
                            color: `white`,
                            textDecoration: `none`,
                        }}
                        >
                            {siteTitle}
                        </a>
                    </Link>
                </h1>
                <p>Clicks: {count}</p>
                <p>DynamicRandom: {rand}</p>
                <p>StaticRandom: {random}</p>
                <Image src={xpShield}
                       width={33}
                       height={40}
                       alt={"Enonic XP logo"}
                />
            </div>
        </header>
    )
}

export default Header
