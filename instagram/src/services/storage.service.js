import { config } from "../config/config.js";
import ImageKit, { toFile } from '@imagekit/nodejs';

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});


export async function uploadFile({ buffer, fileName }) {

    const result = await client.files.upload({
        file: await toFile(buffer, fileName),
        fileName: fileName,
        folder: "/kodr/instagram/posts",
    })

    return result;
}
