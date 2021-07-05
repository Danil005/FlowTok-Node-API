var fs = require('fs');


fs.readFile('./cache/fcd2fbad-3de3-4dd6-8232-95524a7778a9.txt', (err, data) => {
    if (err) {
        console.error(err)
        return
      }
      JSON.parse(data.toString()).waitForTimeout()
})