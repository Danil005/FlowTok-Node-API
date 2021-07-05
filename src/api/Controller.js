class Controller
{
    req = null;
    res = null;
    opts = null;
    error = false;

    constructor(req, res, opts)
    {
        this.req = req
        this.res = res
        this.opts = opts

        this.valid()
    }

    valid() 
    {
        let headers = this.req.headers

        // if( headers.aid == null || headers.aid >= Math.floor(new Date() / 1000) || headers.aid < Math.floor(new Date() / 1000 - 60) ) {
        //     this.res.status(400).json({
        //         success: false,
        //         message: "Bad Request",
        //         data: []
        //     })
        //     this.error = true
        // }
            // throw new Error("my error message");
    }
}

module.exports = Controller