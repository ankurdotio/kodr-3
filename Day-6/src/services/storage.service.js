import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
});


export async function uploadFile(buffer, fileName) {
    const fileResult = await client.files.upload({
        file: await ImageKit.toFile(buffer, fileName),
        fileName: fileName,
    })

    return fileResult;
}