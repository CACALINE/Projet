const fs = require("fs");
const http = require("http");
const host = 'localhost';
const port = 8080;
const server = http.createServer();
const images = fs.readdirSync("./public/images");

server.on("request", (req, res) => {
    if (req.url.startsWith("/public/")) {
        const filePath = '.' + req.url;
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("File not found");
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
    } else if (req.url === '/images') {
        let pageHTML = 
        `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mur d\'images</title>
            <link rel="stylesheet" href="/public/style.css">
        </head>
        <body>
            <a href="/index"> Index</a>
            <div class="center">
                <h1>Mur d\'images</h1>
            </div>
            <div class="center">`;

        for (let i = 0; i  < images.length; i++) {
            if (images[i].endsWith("_small.jpg")) { 
                const id = images[i].match(/\d+/)[0]; 
                pageHTML += 
                `<a href="/page-image/` + id + `"><img src="/public/images/` + images[i] + `"></a>`
            }
        }
        pageHTML += '\t\t</div>\n\t</body>\n</html>\n';
        res.end(pageHTML);

    } else if (req.url.startsWith('/page-image/')) {
        const id = req.url.split('/')[2];
        const Image = images.find((img) => img.startsWith('image' + id + '.jpg'));
        const smallImage = images.find((img) => img.startsWith('image' + id + '_small.jpg'));
        if (Image && smallImage) {
          let previousImageLink = '';
          let nextImageLink = '';
          const nextId = parseInt(id) + 1;
          const nextImage = images.find((img) => img.startsWith('image' + nextId + '_small.jpg'));
          if (nextImage) {
            nextImageLink =
            `<a href="/page-image/` + nextId + `"><img src="/public/images/image` + nextId + `_small.jpg"></a>
            `;
          }
        if (parseInt(id) > 1) {
          previousImageLink = '<a href="/page-image/' + (parseInt(id) - 1) + '" ><img src="/public/images/image' + (parseInt(id) - 1) + '_small.jpg"></a>';
        }

        // Lecture des commentaires depuis le fichier
        fs.readFile('comments.txt', 'utf8', (err, data) => {
            if (err) {
                // Si le fichier n'existe pas, on le crée
                if (err.code === 'ENOENT') {
                    fs.writeFile('comments.txt', '', (err) => {
                        if (err) {
                            console.error(err);
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                        }
                    });
                } else {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                }
            }
            // Filtrage des commentaires associés à l'image actuelle
            let commentsHTML = '';
            if (data) {
                const comments = data.split('\n');
                comments.forEach(comment => {
                    const commentData = comment.split(':');
                    const commentId = commentData[0];
                    const commentText = commentData[1];
                    if (commentId === id) {
                        commentsHTML += `<p>${commentText}</p>`;
                    }
                });
            }
            let imagePageHTML = 
            `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Image ${id}</title>
                <link rel="stylesheet" href="/public/style.css">
            </head>
            <body>
                <a href="/images">Mur</a>
                <div class="center">
                    <div>
                        <img width="500" src="/public/images/${Image}">
                        <p class="center">Une image que j'apprécie</p>
                    </div>
                    <h4>Commentaires</h4>
                    <div>${commentsHTML}</div>
                    <h4>Ajouter un nouveau commentaire</h4>
                    <form action="/save-comment" method="POST">
                        <input type="hidden" name="imageId" value="${id}">
                        <label for="commentaire">Commentaire : </label>
                        <input type="text" name="commentaire" id="commentaire">
                        <input type="submit" value="Envoyer">
                    </form>
                </div>
                <div>
                    <span class="img-prev">${previousImageLink}</span>
                    <span class="img-next">${nextImageLink}</span>
                </div>
            </body>
            </html>`;
            res.end(imagePageHTML);
        });
      } else {
        res.statusCode = 404;
        res.end('Image not found');
      }
    } else if (req.url === '/save-comment' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const formData = new URLSearchParams(body);
            const commentaire = formData.get('commentaire');
            const imageId = formData.get('imageId');
            // Enregistrement du commentaire dans un fichier
            fs.appendFile('comments.txt', imageId + ':' + commentaire + '\n', (err) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(302, { 'Location': '/page-image/' + imageId });
                    res.end();
                }
            });
        });
    } else {
      res.end(fs.readFileSync("./public/index.html", "utf-8"));
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
