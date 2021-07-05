const logger = require('node-color-log');

class viewVideo 
{
    baseAPI = null;
    page = null;


    async get(videoID, opts, aid)
    {
        let timeInMs = Math.floor(Date.now() / 1000)

        this.page = await opts.browser.newPage()
        await opts.setConfig(this.page)
        
        logger.info("Goto To Video ID: " + videoID)
        await this.page.goto("https://m.tiktok.com/v/"+videoID)
        let nameElement = await context.page.$eval('body', el => el.text())
        console.log(nameElement)
        await this.page.waitForFunction((sel) => { 
            return document.querySelectorAll(sel).length;
        },{timeout:10000}, '.tt-feed' + ", " + '.error-page'); 
        nameElement = await context.page.$eval('body', el => el.text())
        console.log(nameElement)
        let error = await this.page.evaluate(() => Array.from(document.querySelectorAll('.error-page'), (element) => {
            return [
                element.querySelector(".title").textContent,
                element.querySelector(".desc").textContent
            ]
        })) 

        if( error.length > 0 ) {
            this.page.close()
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
        logger.info("Comment Button Clicked")
        logger.debug("Start parse comments")

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
        logger.info("Comments >> Successfully Recived")

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

        logger.info("Author Information >> Successfully Recived")
    
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

        logger.info("Video Info >> Successfully Recived")
        this.page.close()
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