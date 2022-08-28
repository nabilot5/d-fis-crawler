const axios = require('axios');
const cheerio = require('cheerio');
const urlParser = require('url');
const fs = require('fs');
const momentJs = require('moment');


const globalUrl = `https://fr.tripadvisor.be/Restaurants-g188646-Charleroi_Hainaut_Province_Wallonia.html`;
const seenUrls = {};
const jsonData = [];
const nameFile = momentJs().format('YYYYMMDDHHmmss') + '.json';
const classNameOfName = 'acKDw';
const parameterOfName = 'h1';
const classOfPhone = 'AYHFM';
const parameterOfPhone = 'a';

// Select the good link
const getUrl = (link, host, protocol) => {
    if (link === undefined) {
        link = null;
    }

    if (link.includes("http")) {
        return link;
    }

    if (link.startsWith("/")) {
        return `${protocol}//${host}${link}`;
    }

    return `${protocol}//${host}/${link}`;
};


// for each link capture data and save it
const crawl = async (nameFile, { url, classNameOfName, parameterOfName, classOfPhone, parameterOfPhone }) => {

    if (seenUrls[url]) {
        return;
    }

    seenUrls[url] = true;

    axios(url).then((res) => {

        let dataOfLink = {
            name: '',
            phone: ''
        };

        const html = res.data;
        const $ = cheerio.load(html);
        const localClassOfName = $(`.${classNameOfName}`);
        const localClassOfPhone = $(`.${classOfPhone}`);

        localClassOfName.each(function () {
            let nameOfParameter = $(this).find(`${parameterOfName}`).text();
            if (nameOfParameter) dataOfLink.name = nameOfParameter;
        });

        localClassOfPhone.each(function () {
            let phoneOfParameter = $(this).find(`${parameterOfPhone}`).text();
            if (phoneOfParameter) dataOfLink.phone = phoneOfParameter;
        });

        if (dataOfLink.name != '') jsonData.push(dataOfLink);
        fs.writeFile(nameFile, JSON.stringify(jsonData), function () {
            console.log(`Le fichier ${nameFile} a été mis à jour, ce restaurant à été ajouté : ${dataOfLink.name} ${dataOfLink.phone}. {${jsonData.length}}`);
        });
    })
};

// Select all page with some
const fetchCrawlLink = async (nameFile, globalUrl, { classNameOfName, parameterOfName, classOfPhone, parameterOfPhone }) => {
    const { host, protocol } = urlParser.parse(globalUrl);

    if (seenUrls[globalUrl]) return;
    seenUrls[globalUrl] = true;

    axios(globalUrl).then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        const links = $("a").map((i, link) => link.attribs.href).get();

        links
            .filter((link) => !link.includes('#REVIEWS') && link.includes('Restaurant_Review-g'))
            .forEach((link) => {
                crawl(nameFile, {
                    url: getUrl(link, host, protocol),
                    classNameOfName: classNameOfName,
                    parameterOfName: parameterOfName,
                    classOfPhone: classOfPhone,
                    parameterOfPhone: parameterOfPhone
                });
            });
    })
};

// for each link capture data and save it
const totalCrawl = async (nameFile, globalUrl, { classNameOfName, parameterOfName, classOfPhone, parameterOfPhone }) => {
    const { host, protocol } = urlParser.parse(globalUrl);

    fetchCrawlLink(nameFile, globalUrl, { classNameOfName, parameterOfName, classOfPhone, parameterOfPhone });

    try {
        const { data } = await axios(globalUrl);
        const html = data;
        const $ = cheerio.load(html);
        const newLink = $(`.${'nav.next'} `)[0].attribs.href;

        if (newLink === undefined) return;
        let newGlobalUrl = getUrl(newLink, host, protocol).replace('#EATERY_LIST_CONTENTS', '');
        await totalCrawl(nameFile, newGlobalUrl, { classNameOfName, parameterOfName, classOfPhone, parameterOfPhone });
    } catch (error) {
        console.log(error);
    }
};

// Execution
totalCrawl(nameFile, globalUrl, { classNameOfName, parameterOfName, classOfPhone, parameterOfPhone });