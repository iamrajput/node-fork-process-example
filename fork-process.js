const express = require('express')
const {fork} = require('child_process')
const app = express()

// normal funtion call (takes around 10.088745682 s)
app.get('/first',(req,res) => {
   const sum = longTimeTaking()
   res.send({sum:sum})  // 
})
//coz it's start on  the same process the time and all are same async call
//(takes around 10.088745682 s)
// this is coz it's running on the same process that's the reason 
// the time taken is same
app.get('/second',async(req,res) => {
const sum = await longTimeTakingWithPromise()
   res.send({sum:sum})
})

//here we are using node.js child process fork
// 0.018008409 s 
// as it is running as a different process it will not stop the main thread
// and process the task in less time
app.get('/three',(req,res) => {
    const child =  fork('./longTask.js') //run on different thread
    child.send('start')
    child.on('message',(sum) => {
      res.send({sum:sum})
    })
})


app.listen(3000,() => {
    console.log('server is running on port 3000')
})

function longTimeTaking(params) {
    let sum =0
    for (let index = 0; index < 1e9; index++) {
       sum += index;
    }
    return sum;
}

function longTimeTakingWithPromise(params) {
   return new Promise((resolve,reject) => {
    let sum =0
    for (let index = 0; index < 1e9; index++) {
       sum += index;
    }
    resolve(sum)
   })
}


