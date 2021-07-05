const logger = require('node-color-log');
const api = require('./route/api')

class RouteControl
{
    routeApi = null;

    constructor()
    {
        this.routeApi = api
    }

    async build(api)
    {
        /**
         * Session Routes
         */
        api.app.post('/session/session.create', (req, res) => api.session(req, res).create())


        /**
         * Video Routes
         */
        api.app.get('/video/video.get', (req, res) => api.video(req, res).get())
    }
}

module.exports = RouteControl