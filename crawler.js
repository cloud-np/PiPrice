import fetch from "node-fetch";
import puppeteer from "puppeteer";
import cheerio from "cheerio";

export class Crawler {
  SKROUTZ_URL = 'https://www.skroutz.gr/'
  PLASIO_URL = 'https://www.plaisio.gr/'
  PUBLIC_URL = 'https://www.public.gr/'

  // No async constructors possible, but we can use an IIAFE for async code.
  // Note that the return type of any async function is a promise, which we can store.
  constructor(){
    // this.browser = await puppeteer.launch({ headless: true });
    // this.page = await this.browser.newPage();
    this.browser = null;
    this.page = null;
    // set viewport and user agent (just in case for nice viewing)
    // await page.setViewport({width: 1366, height: 768});
    // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
  }

  async init(){
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage(); 
  }

  async searchOnSkroutz(searchTerm) {
      const p = this.page;
      await p.type("//input[#search-bar-input]", searchTerm);
      await p.click('[type="submit"]');
      await p.click('//div[#order-options]/ul/li/a');
      await p.waitForTimeout(50);
      await p.click('//div[#order-options](/ul/li/a)[1]');
      await p.waitForTimeout(1000);
      const firstEl = await p.$x('//div[@class="card-content"]/h2/a');
      let firstUrl = await p.evaluate((el) => el.getAttribute("href"), firstEl[0]);
      console.log(firstUrl);
  }


  async parsePlaisioItem(url, isNewItem = false) {
    const page = this.page;


    await page.goto(url, { timeout: 60000, waitUntil: "domcontentloaded" })
    // .then(() => { console.log("Loaded page"); });

    // Get the title
    const titleEl = await page.$x("//h1[@class='product-title']");
    let title = await page.evaluate((el) => el.textContent, titleEl[0]);
    console.log("title: ", title);

    // Get the price
    const priceEl = await page.$x("//div[@class='price']");
    let price = await page.evaluate((el) => el.textContent, priceEl[0]);

    // Get the img
    await page.waitForXPath("//li[@class='swiper-slide']/picture/img");
    const imgEl = await page.$x("//li[@class='swiper-slide']/picture/img");
    let img = await page.evaluate(
      (el) => el.getAttribute("data-srcset"),
      imgEl[0]
    );

    // Get the availability
    await page.waitForXPath("//div[@class='product__stockindication-label']");
    const availabilityEl = await page.$x(
      "//div[@class='product__stockindication-label']"
    );
    let availability = await page.evaluate(
      (el) => el.textContent,
      availabilityEl[0]
    );
    console.log("availability: ", availability);
    // Διαθέσιμο για παράδοση

    console.log("price: ", price);
    console.log("img: ", img);
    await browser.close();
  }

  static async parseSkroutzItem(url, isNewItem = false) {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const createdAt = new Date();

    try {
      let item = {
        name: $(".page-title").text(),
        imgUrl: "https:" + $(".sku-image").attr("href"),
        ratingStars: parseFloat(
          $("a.rating.big_stars")
            .first()
            .attr("title")
            .split()[0]
            .replace(",", ".")
        ),
        usersRated: parseInt(
          $("div.reviews-count").first().children("a").text()
        ),
        price: parseFloat(
          $("strong.dominant-price").first().text().split()[0].replace(",", ".")
        ),
        shopUrl:
          "https://www.skroutz.gr" +
          $("a.js-product-link").first().attr("href"),
        url: url,
        updatedAt: createdAt,
      };
      if (isNewItem === true) item.createdAt = createdAt;
      return item;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

// export default parseSkroutzItem;
// export default parsePlaisioItem;
