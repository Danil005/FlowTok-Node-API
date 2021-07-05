class Cookies 
{
    cookie = []

    constructor(cookie)
    {
        cookie = cookie.split('; ')
        for (let i = 0; i < cookie.length; i++) {
            cookie[i] = cookie[i].split('=')
        }

        this.cookie = cookie
    }

    /**
     * Получить все куки
     * 
     * 
     * @returns array
     */
    get()
    {
        return this.cookie
    }

    /**
     * Установить Cookie для Chromium
     * 
     * 
     * @param {*} page 
     */
    async setCookies(page)
    {
        let cookie = []
        for(let i = 0; i < this.cookie.length; i++) {
            cookie = this.cookie[i]
            await page.setCookie({name: cookie[0], value: cookie[1], domain: ".tiktok.com", path: "/"})
        }

        return page;
    }
}

module.exports = Cookies