const app=require('./app');
const socketIo = require('socket.io');
const Crop= require('./models/crops');

const mongoose=require('mongoose');
const port=process.env.PORT || 3000;

const { spawn } = require('child_process');

// Spawn Flask process
const flaskProcess = spawn('python', ['app.py']);

flaskProcess.stdout.on('data', (data) => {
    console.log(`Flask stdout: ${data}`);
});

flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask stderr: ${data}`);
});

flaskProcess.on('close', (code) => {
    console.log(`Flask process exited with code ${code}`);
});

// Optional: Handle shutdown gracefully
process.on('exit', () => {
    flaskProcess.kill();
});


 mongoose.connect("mongodb+srv://wafaakadry756:tNtV3INS0oIi3cIy@wafaaa.srergbn.mongodb.net/grad_db?retryWrites=true&w=majority&appName=wafaaa")
 //mongoose.connect("mongodb://localhost:27017/farm_project")
 .then(result=>{
  const server=app.listen(port,()=>{
    console.log("server is starting running...")});
    const io=socketIo(server);
    io.on('connection', (socket) => {
      const { cropId } = socket.handshake.query;

      console.log(`Client connected for cropId: ${cropId}`);
      setInterval(() => {
       Crop.findById(cropId)
      
        .then ( crop => {
        
    
       
            const newReading = {
              soilMoisture: Math.random() * 100, // Simulate sensor reading
              timestamp: Date.now()
            };
    
            crop.sensorData.push(newReading); // Append the new reading to the sensorData array
            crop.save();
    
            // Emit updated sensor data to the client
            socket.emit('sensorData', { cropId: crop._id, sensorData: newReading });
         
        });
      }, 5000);
    });
    
 } )
 
  
  
 .catch(err=>{
  console.log(err);
 });

 //mongodb+srv://wafaakadry756:8xp7ynrC3Y91E7Q0@wafaaa.srergbn.mongodb.net/?retryWrites=true&w=majority&appName=wafaaae:\detect\Detect disease\app.py