// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/connection.js');
const User = require('./models/user.js')
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');


// Initialize the app
const app = express();
connectDB()

// Load environment variables from .env file
dotenv.config();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

//seting up multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

// Define a sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js Backend!');
});

// Define another sample route
app.post('/api/data', async (req, res) => {
    
    const { username, email, phone, password } = req.body.formData;
   
        // console.log(username + ' ' + email);
   try{
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        email,
        phone,
        password:hash,
   })
   if(newUser){
    console.log("user created successfully")
    res.status(200).json({
        status: 'success',
    });
   }
   }
   catch(err){
       console.error(err.message);
       res.status(500).send('Server Error');
   }

// res.status(200).json({
//             status: 'success',
//         });

})

app.post('/api/salon', upload.single('image'), async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    res.status(200).json({
        status:'success',
        message: "Salon image uploaded successfully"
    })
})

app.post("/api/login", async (req, res) => {
    const{ identifier,password} = req.body.formData
    const role = req.body  // defines that the person is an user or the salon owner
    const user = await User.findOne({
        // $or: [{ username: identifier }, { email: identifier }]
        username: identifier
    })
    if(!user){
        // console.log("Invalid credentials")
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        // console.log("invalud password")
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }
    res.status(201).json({
        message: "Login successful",
    })
})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
