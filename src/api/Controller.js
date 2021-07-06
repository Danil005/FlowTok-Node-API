const logger = require('node-color-log');
class Controller
{
    req = null;
    res = null;
    opts = null;
    error = false;
    page = null;
    pageId = null

    constructor(req, res, opts, page)
    {
        this.req = req
        this.res = res
        this.opts = opts
        this.page = page

        this.headers = req.headers
        this.valid()
    }

    valid() 
    {
        let headers = this.req.headers

        // if( headers.aid == null || headers.aid >= Math.floor(new Date() / 1000) || headers.aid < Math.floor(new Date() / 1000 - 60) ) {
            // this.res.status(400).json({
            //     success: false,
            //     message: "Bad Request",
            //     data: []
            // })
            // this.error = true
        // }
            // throw new Error("my error message");
    }

    async getPages()
    {
        this.pageId = await this.opts.redis.getAsync('flowtok_node:session:' + this.headers.uid + ':pages:' + this.headers.session)

        if( this.pageId == null && !this.error ) {
            this.res.status(400).json({
                success: false,
                message: "Browser session not exist",
                data: []
            })
            this.error = true
            logger.error('Browser session not exist')
        }
    }
}

module.exports = Controller