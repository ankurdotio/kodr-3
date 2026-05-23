const fs = require('fs')

try {
    fs.accessSync("./sandbox/temp")
}catch (err) {
    fs.mkdirSync("./sandbox/temp", { recursive: true })
}

fs.writeFileSync('./sandbox/temp/test.txt', 'Hello World', 'utf-8')

