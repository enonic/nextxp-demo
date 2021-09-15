import {Photo} from "../data/queries/getPerson";

type DisplayablePhoto = {
    imageUrl?: string,
    alt?: string
};


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
    return {
        imageUrl: photo.imageUrl,
        alt
    };
}
