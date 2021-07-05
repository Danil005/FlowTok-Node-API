const logger = require('node-color-log');
const uuidAPIKey = require('uuid-apikey');
const CaptchaSolver = require('tiktok-captcha-solver')
const fs = require('fs');
const stringify = require('../../utils/json.utils');
class Create
{
    async build(id, opts, page)
    {
        let uuid = uuidAPIKey.create().uuid

        opts.redis.set('flowtok_node:session:' + id + ':uuid', uuid)

        page = await opts.browser.newPage()
        opts.setConfig(page)
        let pages = await opts.browser.pages()
        this.opts = opts

        opts.redis.set('flowtok_node:session:' + id + ':pages:'+uuid, pages.length)

        return {
            success: true,
            message: "UUID Session Page Generated",
            data: {
                uuid: uuid
            }
        }
    }
}

module.exports = new Create