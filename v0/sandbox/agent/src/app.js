import express from 'express';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs/promises';


const WORKDIR = "/workspace"

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * @route GET /list-files
 * @description list all the files in the WORKDIR directory recursively and return array of string(file paths) eg.
 * [
 *  "vite.config.js",
 *  "src/App.jsx",
 *  "src/App.css",
 * ]
 *
 * this exclude directories like node_modules, .git, dist, build, etc. 
 */

async function listFiles(dir) {
    let results = [];
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const file of list) {
        if (file.isDirectory()) {
            if ([ 'node_modules', '.git', 'dist', 'build' ].includes(file.name)) {
                continue; // skip these directories
            }
            const subDirFiles = await listFiles(path.join(dir, file.name));
            results = results.concat(subDirFiles);
        } else {
            results.push(path.relative(WORKDIR, path.join(dir, file.name)));
        }
    }
    return results;
}

app.get('/list-files', async (req, res) => {
    try {
        const files = await listFiles(WORKDIR);
        res.json({
            message: 'Files listed successfully',
            files: files
        });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ error: 'Failed to list files' });
    }
});


/**
 * @route GET /read-files
 * @description read all the files provided in the query parameter "files" and return an object with file name as key and file content as value eg.
 * {
 *  "vite.config.js": "file content",
 *  "src/App.jsx": "file content",
 * }
 */

app.get('/read-files', async (req, res) => {
    const files = req.query.files;
    if (!files) {
        return res.status(400).json({ error: 'No files provided' });
    }

    const fileList = files.split(',').map(file => file.trim());

    const result = {};

    for (const file of fileList) {
        try {
            const content = await fs.readFile(path.join(WORKDIR, file), 'utf-8');
            result[ file ] = content;
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
            result[ file ] = `Error reading file: ${error.message}`;
        }
    }

    res.json({
        message: 'Files read successfully',
        files: result
    });
});


/**
 * @route POST /update-files
 * @description update the files provided in the request body with the content provided in the request body. The request body should be an object with file name as key and file content as value eg.
 * {
 *  "vite.config.js": "new file content",
 *  "src/App.jsx": "new file content",
 * }
 */
app.post('/update-files', async (req, res) => {
    const files = req.body.files;
    if (!files || typeof files !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    const result = {};

    for (const [ file, content ] of Object.entries(files)) {
        try {
            try {
                await fs.access(path.dirname(path.join(WORKDIR, file)))
            }
            catch {
                await fs.mkdir(path.dirname(path.join(WORKDIR, file)), { recursive: true });
            }

            await fs.writeFile(path.join(WORKDIR, file), content, 'utf-8');
            result[ file ] = 'File updated successfully';
        } catch (error) {
            console.error(`Error updating file ${file}:`, error);
            result[ file ] = `Error updating file: ${error.message}`;
        }
    }

    res.json({
        message: 'Files updated successfully',
        files: result
    });
});



app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;