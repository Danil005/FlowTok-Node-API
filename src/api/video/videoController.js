const logger = require('node-color-log');
const {video} = require('./../../APIList')
const Controller = require("./../Controller")

class VideoController extends Controller
{
    async get()
    {
        logger.info('API >> video.get >> send')
        const id = this.req.query.id;
        if(this.error) {
            return;
        }

        if( id == undefined )
            return this.res.json({
                success: false,
                message: "Param `id` is required",
                data: []
            })
        let result = await video.get(id, this.opts, this.page)
        this.res.json(result)
    }
}

module.exports = VideoController