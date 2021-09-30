export default (scale:string) => (
`                   ... on media_Image {
                      imageUrl: imageUrl(type: absolute, scale: "${scale}")
                      attachments {
                        name
                      }
                      xAsJson
                    }`);

// TODO: better than xAsJson, but may require guillotine schema update:
/*
x {
    media {
        imageInfo {
            imageHeight
            imageWidth
        }
    }
}
 */

export type Photo = {
    // _id: string,
    attachments?: {
        name?: string
    }[]
    imageUrl?: string,
    xAsJson?: {
        media?: {
            imageInfo?: {
                imageHeight?: number|string,
                imageWidth?: number|string,
            }
        }
    }
};
