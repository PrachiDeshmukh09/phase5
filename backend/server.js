const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); 

console.log(cors());
const app = express();  
const PORT = 3000;

const apiKey = process.env.API_KEY;

app.use(cors()); 
app.use(express.json()); 


if (!apiKey) {
    console.log("API key missing");
    process.exit(1);
}


app.get("/", (_, res) => {
    res.send("Server is running");
});


app.post("/ask", async (req, res) => {
    try { 
        const userQuestion = req.body.question;
        if (!userQuestion) {
            return res.status(400).json({
                error: "Please enter a question"
            });
        }

      console.log('object') 
        const response = await axios.post(                           
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `give me answer 2 to 3 line : ${userQuestion}`
                
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }  
        );

        const answer =
            response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) { 
            return res.status(500).json({
                error: "No answer received from Gemini"
            });
        }

       
        res.json({
            answer
        });

    } catch (error) {

        console.log("GEMINI ERROR ");
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Message:", error.message);
        

        res.status(error.response?.status || 500).json({
            error:
                error.response?.data?.error?.message ||
                error.message ||
                "Something went wrong"
        });
    }
});


app.listen(PORT, () => {
    console.log(` Server running ${PORT}`);
})


