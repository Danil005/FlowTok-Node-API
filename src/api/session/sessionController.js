const logger = require('node-color-log');
const Controller = require("../Controller")


const create = require('./create.api')
const remove = require('./delete.api')

class SessionController extends Controller
{
    constructor(req, res, opts) 
    {
        super(req, res, opts)

        this.headers = this.req.headers
      
    }

    async create()
    {

        if(this.error) {
            return;
        }

        logger.info('API >> session.create >> send')

        const id = this.req.headers?.uid;

        if( id == undefined ) {
            logger.error('Invalid Headers')
            return this.res.json({
                success: false,
                message: "Invalid Headers",
                data: []
            })
        }

        let result = await create.build(id, this.opts, this.page)
        this.res.json(result)
    }

    async delete()
    {
        await this.getPages()
        if(this.error) {
            return;
        }

        logger.info('API >> session.delete >> send')

        const id = this.req.headers?.uid;
        const session = this.req.headers?.session;

        if( id == undefined || session == undefined ) {
            logger.error('Invalid Headers')
            return this.res.json({
                success: false,
                message: "Invalid Headers",
                data: []
            })
        }

        let result = await remove.build(id, this.opts, this.pageId, session)
        this.res.json(result)
    }
}

module.exports = SessionController