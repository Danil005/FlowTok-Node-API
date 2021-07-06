var fs = require('fs');
const {MongoClient} = require('mongodb');
const assert = require('assert');
const axios = require('axios')

const username = encodeURIComponent("fiks");
const password = encodeURIComponent("JusTcause45330");
const uri = `mongodb://${username}:${password}@80.78.246.228:27017?authMechanism=DEFAULT`;
const client = new MongoClient(uri, { useUnifiedTopology: true } );

(async () => 
{  

  let links = [
    6981451053128633602
  ]
  await client.connect();

  const db = await client.db('jack-flow');
  collection = await db.collection('comments')
  const instance = axios.create({
    baseURL: 'http://80.78.246.228:3217',
    timeout: 60000,
    headers: {
      'uid': '1'
    }
  });

  const options = {
    method: 'POST',
    url: 'session/session.create'
  };

  let uuid = await instance(options)


  let optVideoGet = []
  for(let i = 0; i < links.length; i++) {
    optVideoGet = {
      method: 'GET',
      url: 'video/video.get?id='+links[i],
      headers: {"uuid": uuid.data.data.uuid}
    }
  
    let result = await instance(optVideoGet)
    console.log(result.headers)

    console.log(result)
  }
  
  // await collection.insertOne({
  //   comment: "test",
  //   status: {
  //     negative: 0,
  //     positive: 0
  //   },
  //   like: 0,
  //   solution: 'indefinitely'
  // })
  // await client.close();
  // let links = [
  //   ""
  // ]

  // let commentsJson = JSON.parse(await fs.readFileSync('./cache/comments.json'))
  // await fs.writeFileSync('./cache/comments.json', JSON.stringify(commentsJson))
})();
