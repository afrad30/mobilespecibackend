const http = require('http');
const fs = require('fs');

 
// Create simple echo bot
login({email: "FB_EMAIL", password: "FB_PASSWORD"}, (err, api) => {
    if(err) return console.error(err);
 
    api.listen((err, message) => {
        api.sendMessage(message.body, message.threadID);
    });
})

const dataString = fs.readFileSync('data.json', 'utf-8');
const data = JSON.parse(dataString);

const overView = fs.readFileSync('templates/overview_template.html', 'utf-8');
const cardTemplate = fs.readFileSync('templates/card_template.html', 'utf-8');

const server = http.createServer((req, res) => {
  const pathName = req.url;
  if(pathName === '/overview' || pathName === '/'){
    res.writeHead(200, {
      'Content-type': 'text/html',
    })
    const cards = data.map(mobile => {
      let card = cardTemplate;
      card = card.replace('%image%', mobile.image);
      card = card.replace('%name%', mobile.name);
      card = card.replace('%ram%', mobile.ram);
      card = card.replace('%rom%', mobile.rom);
      card = card.replace('%id%', mobile.id);
      card = card.replace('%price%', mobile.price);
      return card
    })
    const template = overView.replace('%product-cards%', cards.join(''))
    res.end(template)
  }else if(pathName === '/mobile'){
    res.end('Hello from laptop page!');
  } else if(pathName === '/api'){
    res.writeHead(200, {
      'Content-type': 'application/json',
    })
    res.end(dataString);
  }else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'This is a test'
    })
    res.end()
  }
});

server.listen(1300, '127.0.0.1', () => {
  console.log();
})