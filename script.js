
async function askQuestion() {
    const question = document.getElementById("question").value; 
    const answerBox = document.getElementById("answer");       

    if (!question) {
        alert("Please enter a question");
    }

    answerBox.innerText = "Thinking...";

    try {
        const response = await fetch("http://localhost:3000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        answerBox.innerText = data.answer || data.error;

    } catch (error) {
        console.log(error);
        answerBox.innerText = "Server error";
    }
}