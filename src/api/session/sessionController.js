const logger = require('node-color-log');
const Controller = require("../Controller")
const create = require('./create.api')

class SessionController extends Controller
{
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
}

module.exports = SessionController