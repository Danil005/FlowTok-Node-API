const logger = require('node-color-log');
const fs = require('fs')
class viewVideo 
{
    baseAPI = null;
    page = null;


    async get(videoID, opts, page)
    {

        this.page = await opts.browser.pages()
        this.page = await this.page[page-1]
        
        logger.debug("Goto To Video ID: " + videoID)
        await this.page.goto("https://m.tiktok.com/v/"+videoID)


        // let nameElement = await this.page.$eval('body', el => el.textContent)
        // console.log(nameElement)


        await this.page.waitForFunction((sel) => { 
            return document.querySelectorAll(sel).length;
        },{timeout:10000}, '.tt-feed' + ", " + '.error-page');

        // nameElement = await this.page.$eval('body', el => el.textContent)
        // console.log(nameElement)


        let error = await this.page.evaluate(() => Array.from(document.querySelectorAll('.error-page'), (element) => {
            return [
                element.querySelector(".title").textContent,
                element.querySelector(".desc").textContent
            ]
        })) 

        if( error.length > 0 ) {
            return {
                success: false,
                message: error[0][0],
                data: []
            }
        }

        await this.page.evaluate(() => {
            let removeElements = [
                '.item-video-container',
                '.side-bar'
            ]
            for(let i = 1; i < removeElements.length; i++) {
                document.querySelector(removeElements[i]).remove()
            }

            let wrappers = Array.from(document.querySelectorAll('.lazyload-wrapper'))
            
            for(let i = 1; i < wrappers.length; i++) {
                wrappers[i].remove()
            }
        })

        let commentButton = await this.page.$$('.bar-item-img.engagement-icon-v23')
        commentButton[1].click()

        await this.page.waitForSelector('.video-card-container')
        await this.page.evaluate(() => {
            document.querySelector('.video-card-container').remove()
        })

        /**
         * Собираем комментарии в виде объекта
         * [
         *  {
         *      userData: {link: "", photo: "", name: ""},
         *      comments: {text: "", "likes": "0", countMore: "0"}
         *  },
         *  ...
         * ]
         *  
         * */ 
        await this.page.waitForSelector(".comment-text span:not(.comment-time):not(.reply)")
        let comments = await this.page.evaluate(() => 
        Array.from(document.querySelectorAll('.comments .comment-item'), (element) => {
            let userData = {
                link: element.querySelector("a").getAttribute("href"),
                photo: element.querySelector("a img").getAttribute("src"),
                name: element.querySelector(".content-container .user-info .username").textContent
            }
            let commentText = element.querySelector(".comment-text span:not(.comment-time):not(.reply)").textContent
            let likesComment = element.querySelector(".like-container .count")
        
            let comments = {
                text: commentText,
                likes: likesComment != undefined ? likesComment.textContent : "0",
                countMore: element.querySelector(".view-more")?.textContent.replace(/^\D+/g, '').replace(')', '') ?? "0"
            }
        
            return {
                userData: userData,
                comments: comments
            }
        }));

        /**
         * Получаем информацию об авторе
         * {nameTag: "", nickname: ""}
         */
        let author = await this.page.evaluate(() => Array.from(document.querySelectorAll(".user-info-container"), (element) => {
            return {
                nameTag: element.querySelector(".user-username").textContent,
                nickname: element.querySelector(".user-nickname").textContent,
            }
        }))

        if( author.length > 0 ) {
            author = author[0]
        }

    
        let videoInfo = await this.page.evaluate(() => Array.from(document.querySelectorAll(".video-infos-container"), (element) => {
            let description = element.querySelectorAll("strong:not(a)")
            description = ( description[0] != undefined) ? description[0].textContent : null
        
            let tags = element.querySelectorAll("a strong")
            tags = ( tags[0] != undefined) ? Array.from(tags, el => el.textContent.trim()) : null  
        
            let music = element.querySelector(".music-info")
            let musicInfo = music.textContent.split('-')
        
            return {
                description: description,
                tags: tags,
                likes: element.querySelector(".like-text").textContent,
                comments: element.querySelector(".comment-text").textContent,
                music: {
                    link: music.querySelector("a").getAttribute("href"),
                    author: musicInfo[1] != undefined ? musicInfo[1].trim() : null,
                    title: musicInfo[0] != undefined ? musicInfo[0].trim() : null,
                }
            }
        }))

        if( videoInfo.length > 0 ) {
            videoInfo = videoInfo[0]
        }
        
        let data = ""
        for(let i = 0; i < comments.length; i++) {
            data += await comments[i].comments.text + "|\n\n"
        }

        await fs.appendFileSync('./cache/comments.txt', data)

        logger.info("API >> video.get >> recived")
        return {
            success: true,
            message: "Video Recived",
            data: {
                author: author,
                video: videoInfo,
                comments: comments
            }
        }
    }
}

module.exports = viewVideo;