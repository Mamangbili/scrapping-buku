import puppeteer from 'puppeteer'
import fs from 'fs'



const getBook = async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    })

    const page = await browser.newPage()

    await page.goto("http://books.toscrape.com/", { waitUntil: 'domcontentloaded' })


    const pages = []
    
    const extractBookPerPage = async ()=>{
        const section = await page.$('section')
        const result = await section.$$eval(".product_pod > h3 > a", nodes => nodes.map((each)=>each.innerHTML))
        return result
    }
    
    const clickAndWait = async ()=>{
        await page.click('li.next>a');
        await page.waitForSelector('li.next>a')
    }
    
    const extract10Pages = async ()=>{
        const result = {}
        for(let i = 0 ; i <= 10; i++){
            if(i<10){
                result[i]=(await extractBookPerPage())
                await clickAndWait()
            }
                else result[i]= (await extractBookPerPage())
        }       
        return result;
    }
    
    const result = await extract10Pages()


    await browser.close()
    return result
}

const books = JSON.stringify(await getBook())

fs.writeFile("bookTitle.txt", books, (err) => {
    err ? console.log("terjadi kesalahan") : console.log("file berhasil dibuat")

})