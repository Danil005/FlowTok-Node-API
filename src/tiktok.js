'use strict'
const logger = require('node-color-log');
const API = require('./API')

class TikTok 
{
    browser = null;
    page = null;
    cookies = null;
    api = null;



    constructor()
    {
        logger.info("TikTok API Inited");
    }

    async setConfig(page)
    {
        this.cookies.setCookies(page)
        logger.info("Authorization successfully")
    }

    async build(callback, cookies)
    {
        this.browser = callback
        this.cookies = cookies

        this.api = await new API().build({
            browser: callback,
            cookies: cookies,
            setConfig: this.setConfig
        })

        // this.viewVideo('6957346823749111042')
    }
}


module.exports = TikTok;