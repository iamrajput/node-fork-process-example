const express = require('express')
const cluster = require('cluster')
const os = require('os')

const app = express()

const numCpu = os.cpus().length //number of cpu present

app.get('/',(req,res) => {
    let sum =0
    for (let index = 0; index < 1e9; index++) {
       sum += index;
    }
   // return sum;
   res.send(`Coming from pid ${process.pid}`)
   //cluster.worker.kill() //kill the currently running workers
})

//we need to check if the cluster is master process
if(cluster.isMaster){
   for (let i = 0; i< numCpu; i++) {
       cluster.fork(); //it will create new worker process
   }
   cluster.on('exit',(worker,code,signal) => {
       console.log(`Worker ${worker.process.pid} died`)
       cluster.fork();
   })
}else{
    app.listen(3000,() => {
    console.log(`server ${process.pid} is running on port 3000`)
})
}



