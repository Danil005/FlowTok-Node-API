const logger = require('node-color-log');
const express = require("express");
const CaptchaSolver = require('tiktok-captcha-solver')
const routeControl = require("./RouteControl");

const videoController = require("./api/video/videoController");
const sessionController = require("./api/session/sessionController");

class API
{
    port = 3217;

    app = null;
    json = null;
    opts = null;
    page = null;

    async build(opts)
    {
        this.app = express()
        this.json = express.json()
        this.opts = opts

        await new routeControl().build(this)

        // this.page = await opts.browser.newPage()
        // await opts.setConfig(this.page)
        // const captchaSolver = new CaptchaSolver(this.page)
        // await this.page.goto('https://tiktok.com/')
        // logger.error('Start slove captcha')
        // await captchaSolver.solve()
        // logger.debug('Success sloved')

    
        

        // Listen Server Express On Port
        this.app.listen(this.port, () => { 
            logger.warn('API Interface Mounted on Port -> ' + this.port)
        })
    }

    video(req, res)
    {
        return new videoController(req, res, this.opts, this.page)
    }

    session(req, res)
    {
        return new sessionController(req, res, this.opts, this.page)
    }
}

module.exports = API