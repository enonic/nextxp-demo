import {apiDomain} from '../../enonic-connection-config'

import {Photo} from "../data/queries/getPhoto";

type DisplayablePhoto = {
    imageUrl?: string,
    alt?: string,
    width?: number,
    height?: number,
    aspect: number
};

const parseImageDimension = (imageDimension: number|string|undefined) => {
    switch (typeof imageDimension) {
        case 'number':
            return imageDimension;
        case 'string':
            return parseInt(imageDimension, 10);
    }
}

export const getFirstPhotoData = (photos: Photo|Photo[]|undefined): DisplayablePhoto | undefined => {
    // @ts-ignore
    const photo: Photo|undefined = (Array.isArray(photos) && photos.length > 0)
        ? photos[0]
        : photos;
    if (!photo) {
        return undefined;
    }

    // @ts-ignore
    const alt = (photo.attachments || photo.attachments.length > 0)
        ? (photo.attachments || [])[0].name
        : "";

    // @ts-ignore
    const width = parseImageDimension(photo.xAsJson?.media?.imageInfo?.imageWidth);
    // @ts-ignore
    const height = parseImageDimension(photo.xAsJson?.media?.imageInfo?.imageHeight);

    const aspect = (width && height) ? width/height : 1;

    // @ts-ignore
    return {
        imageUrl: apiDomain + photo.imageUrl,
        alt, width, height, aspect
    };
}
