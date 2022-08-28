const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://fr.tripadvisor.be/Restaurant_Review-g188646-d23808017-Reviews-Emocion_Le_Bois_Du_Cazier-Charleroi_Hainaut_Province_Wallonia.html');
//     const searchValue = await page.evaluate(
//         () => Array.from(
//             document.querySelectorAll('a[href]'),
//             a => a.getAttribute('href')
//         )
//     );
//     console.log(searchValue);

//     await browser.close();
// })();

// Collect name and phone

const collectingNameAndPhone = async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://fr.tripadvisor.be/Restaurant_Review-g188646-d23808017-Reviews-Emocion_Le_Bois_Du_Cazier-Charleroi_Hainaut_Province_Wallonia.html');
    const resultat = await page.evaluate(() => {
        let name = document.querySelector(".HjBfq").innerText
        let phone = document.querySelector(".AYHFM.BMQDV").innerText
        return { name, phone };
    });
    console.log(resultat.name, resultat.phone);
    await browser.close();
}

collectingNameAndPhone();