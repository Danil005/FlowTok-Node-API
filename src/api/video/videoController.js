const logger = require('node-color-log');
const {video} = require('./../../APIList')
const Controller = require("./../Controller")

class VideoController extends Controller
{
    headers = null

    constructor(req, res, opts) 
    {
        super(req, res, opts)

        this.headers = this.req.headers
        
        if( this.headers.session == null || this.headers.uid == null ) {
            this.res.status(400).json({
                success: false,
                message: "Browser session not created",
                data: []
            })
            this.error = true
            logger.error('Browser session not created')
        }
    }

    async get()
    {
        await this.getPages()
        

        if(this.error) {
            return;
        }

        logger.info('API >> video.get >> send')
        const id = this.req.query.id;

        if( id == undefined )
            return this.res.json({
                success: false,
                message: "Param `id` is required",
                data: []
            })
        
        let result = await video.get(id, this.opts, this.pageId)
        this.res.json(result)
    }
}

module.exports = VideoController