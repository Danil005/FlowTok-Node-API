const logger = require('node-color-log');

class Delete
{
    async build(id, opts, page, session)
    {
        opts.redis.set('flowtok_node:session:' + id + ':pages:' + session, -1, 'EX', 1)

        try {
            let pages = await opts.browser.pages()

            page = pages[page - 1]
            logger.info('Page closed')
            await page.close()
        } catch (e) {
            logger.warn('Page was closed')
        }

        return {
            success: true,
            message: "UUID Session Page Closed",
            data: []
        }
    }
}

module.exports = new Delete