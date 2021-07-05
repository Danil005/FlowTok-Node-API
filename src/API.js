const logger = require('node-color-log');
const express = require("express");

const videoController = require("./api/video/videoController");

class API
{
    port = 3217;

    app = null;
    json = null;
    opts = null;

    async build(opts)
    {
        this.app = express()
        this.json = express.json()
        this.opts = opts
        // Routes
        this.app.get('/video/video.get', (req, res) => this.video(req, res).get())


        // Listen Server Express On Port
        this.app.listen(this.port, () => { 
            logger.warn('API Interface Mounted on Port -> ' + this.port)
        })
    }

    video(req, res)
    {
        return new videoController(req, res, this.opts)
    }
}

module.exports = API