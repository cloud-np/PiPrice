import express from 'express';
import { Crawler } from './crawler.js';

const app = express();

// const SkroutzCrawler = require('./SkroutzCrawler');
const crawler = new Crawler();
await crawler.init();

crawler.searchOnSkroutz("3060");

app.get('/', async (req, res) => {
    // const info = await SkroutzCrawler.parseItem('');
    // const info = await parseSkroutzItem('https://www.skroutz.gr/s/27508462/MSI-GeForce-RTX-3060-12GB-Ventus-2X-OC-912-V397-039.html');
    // const plaisioInfo = await Crawler.parsePlaisioItem('https://www.plaisio.gr/anavathmisi-diktia/anavathmisi-pc/kartes-grafikon/zotac-vga-geforce-rtx-3060-amp-white-edition-12-gb_3693260?qId=cbe856e75515db823246ba981ff8e723&qIx=products');
    res.send(plaisioInfo);
});

// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.params.id);
// });

app.listen(3000, () => console.log('Listenin on port 3000!'));
