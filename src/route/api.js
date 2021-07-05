module.exports = [
    {
        method: 'POST',
        path: "session/session.create",
        controller: 'session@create',
        param: []
    },
    {   
        method: "GET",
        path: "video/video.get",
        controller: "video@get",
        params: []
    }
]