import React, { FunctionComponent }  from "react"

import Image from 'next/image'

// See: https://nextjs.org/docs/api-reference/next/image

type ImageProps = {
    src: string,
    width: number,
    height: number,
    alt?: string
};

const Img: FunctionComponent<ImageProps> = ({src, width, height, alt}: ImageProps) => (
    <Image src={src}
           width={width}
           alt={alt}
           height={height} />
);

export default Img;
