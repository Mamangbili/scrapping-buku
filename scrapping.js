import puppeteer from 'puppeteer'
import fs from 'fs'



const getBook = async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    })

    const page = await browser.newPage()

    await page.goto("http://books.toscrape.com/", { waitUntil: 'domcontentloaded' })

    const extractBookPerPage = () => {
        const cardsOfBooks = document.querySelectorAll(".product_pod")
        const title = []
        cardsOfBooks.forEach(each => title.push(each.querySelector("h3 > a ").innerHTML))
        return title
    }

    const result = await page.evaluate(extractBookPerPage)


    await browser.close()
    return result
}

const books = JSON.stringify(await getBook())

fs.writeFile("bookTitle.txt",books, (err)=>{
    err ? console.log("terjadi kesalahan") : console.log("file berhasil dibuat")

})