const express = require('express')
const {fork} = require('child_process')
const app = express()


app.get('/first',(req,res) => {
   const sum = longTimeTaking()
   res.send({sum:sum})
})
//coz it's start on  the same process the time and all are same
app.get('/second',async(req,res) => {
const sum = await longTimeTakingWithPromise()
   res.send({sum:sum})
})


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


