const {video} = require('./../../APIList')
const Controller = require("./../Controller")

class VideoController extends Controller
{
    async get()
    {
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
        let result = await video.get(id, this.opts)
        this.res.json(result)
    }
}

module.exports = VideoController