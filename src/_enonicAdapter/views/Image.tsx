import NextImage, {ImageLoader, ImageLoaderProps, ImageProps} from "next/image";
import {downloadTo, getUrl, IS_DEV_MODE, isServer} from '../utils';
import * as fs from 'fs';

const xpImageLoader: ImageLoader = ({src, width, quality}: ImageLoaderProps) => {
    // find the width url part and use the desired value
    const newSrc = src.replace(/width-[0-9]{1,4}/, `width-${width}`);

    if (IS_DEV_MODE) {
        return newSrc;
    }

    const fileCrumbs = newSrc.substring(newSrc.lastIndexOf('/') + 1).split('.');
    const file = `${fileCrumbs[0]}-${width}.${fileCrumbs[1]}`;

    if (isServer()) {
        const dir = './public/images/remote';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const path = `${dir}/${file}`;
        downloadTo(newSrc, path, (error) => {
            if (error) {
                console.error(error);
            } else {
                console.info(`Image downloaded: ${path}`);
            }
        });
    }
    return getUrl(`images/remote/${file}`);
}

export default function Image(props: ImageProps) {
    return (
        <NextImage
            {...props}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
            sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1920px"
            loader={xpImageLoader}
        />
    );
}
