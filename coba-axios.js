import express from "express";
import axios, { isCancel, AxiosError } from 'axios';
import * as cheerio from "cheerio";

// const port = process.env.PORT || 4000;

// const app = express();

async function scrapAllBook(i) {
    console.log('dipanggil')
    const titles = []
    await axios.get(`http://books.toscrape.com/catalogue/page-${i}.html`)
        .then((res) => {
            const $ = cheerio.load(res.data)
            $('.product_pod > h3 > a').each((index, element) => {
                const title = $(element).text()
                titles.push(title)
            })
        })
    return titles
}



async function scrap10pages() {
    const pages = Array(10).fill(0).map((_, index) => {
        return scrapAllBook(index + 1)
    });
    return Promise.all(pages);
}

console.log(await scrap10pages())