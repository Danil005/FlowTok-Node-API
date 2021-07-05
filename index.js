const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')()
var fs = require('fs');
const TikTok = require('./src/tiktok')
const Cookies = require('./src/utils/cookies.utils')

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
 }   

async function init() {
    let cookies;

    contents = await fs.readFileSync('./storage/cookies.txt', 'utf8');
    cookies = await new Cookies(contents)

    

    // Использует плагин для обхода защиты TikTok
    except = ["chrome.runtime", "navigator.languages"]
    await except.forEach(a => StealthPlugin.enabledEvasions.delete(a));

    await puppeteer.use(StealthPlugin)

    // Запускаем браузер и передаем его в класс
    await puppeteer.launch({
      headless: false, 
      args: ["--no-sandbox", "--remote-debugging-port=0"]
    }).then(async browser => await new TikTok().build(browser, cookies))
}
  
init()

