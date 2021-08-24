
type DisplayablePhoto = {
    imageUrl: string,
    alt: string
};


export const getPhoto = (photos): DisplayablePhoto | undefined => {
    const photo = (Array.isArray(photos) && photos.length > 0)
        ? photos[0]
        : photos;
    if (!photo) {
        return undefined;
    }

    const alt = (photo.attachments || photo.attachments.length > 0)
        ? (photo.attachments || [])[0].name
        : "";

    return {
        imageUrl: photo.imageUrl,
        alt
    };
}
