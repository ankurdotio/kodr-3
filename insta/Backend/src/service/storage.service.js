import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

const imageKitClient = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
})


export async function uploadFile({ buffer, fileName }) {
    const result = await imageKitClient.files.upload({
        file: await ImageKit.toFile(buffer, fileName),
        fileName,
        folder: "kodr-3/insta/posts"
    })

    return result;
}