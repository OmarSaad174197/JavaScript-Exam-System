class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.examContainer = document.getElementById("exam-container");
        this.timerElement = document.getElementById("timer");
        this.nextButton = document.getElementById("next-btn");
        
        this.nextButton.addEventListener("click", () => this.nextQuestion());
        this.loadQuestion();
    }

    loadQuestion() {
        let question = this.questions[this.currentQuestion];
        this.timerElement.style.color = "red";
        
        this.examContainer.innerHTML = `
            <h2>${question.title}</h2>
            ${question.answers.map(answer => 
                `<button class="answer-btn" onclick="quiz.selectAnswer(this, '${answer}')">${answer}</button>`
            ).join("")}
        `;
        
        this.nextButton.disabled = true;
        this.startTimer();
    }

    startTimer() {
        let timeLeft = 10;
        this.timerElement.textContent = `Time Left: ${timeLeft}s`;

        clearInterval(this.timer);
        this.timer = setInterval(() => {
            timeLeft--;
            this.timerElement.textContent = `Time Left: ${timeLeft}s`;
            
            if (timeLeft <= 3) {
                this.timerElement.style.color = "#ff4500";
            }
            if (timeLeft === 0) {
                clearInterval(this.timer);
                this.nextQuestion();
            }
        }, 1000);
    }

    selectAnswer(button, answer) {
        let correctAnswer = this.questions[this.currentQuestion].correct;
        document.querySelectorAll(".answer-btn").forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.4";
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = "#28a745";
            } else {
                btn.style.backgroundColor = "#dc3545";
            }
        });

        if (answer === correctAnswer) {
            this.score++;
            button.style.opacity = "1";
        } else {
            button.style.opacity = "1";
        }
        
        this.nextButton.disabled = false;
        clearInterval(this.timer);
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
            this.loadQuestion();
        } else {
            this.nextButton.style.display = "none";
            this.showResult();
        }
    }

    showResult() {
        let percentage = (this.score / this.questions.length) * 100;
        let resultImage = percentage >= 50 ? "img/success.jpeg" : "img/failure.jpeg";
        let resultMessage = percentage >= 50 ? "Congratulations! You have passed the exam." : "Sorry! You have failed the exam.";
    
        this.timerElement.style.display = "none"; 
    
        let circleRadius = 50;
        let circumference = 2 * Math.PI * circleRadius;
        let progress = circumference * (percentage / 100); // Adjusted to fill clockwise
        
        this.examContainer.innerHTML = `
            <img src="${resultImage}" alt="Result Image" class="result-img">
            <h2 style="font-size: 24px;">Your Score: ${percentage.toFixed(2)}%</h2>
            <div class="progress-container">
                <svg width="140" height="140" viewBox="0 0 120 120">
                    <circle class="progress-background" cx="60" cy="60" r="${circleRadius}" stroke-width="10"></circle>
                    <circle class="progress-circle" cx="60" cy="60" r="${circleRadius}" stroke-width="10"
                        stroke-dasharray="${circumference}" stroke-dashoffset="0" 
                        transform="rotate(-90 60 60)"></circle>
                    <text x="60" y="60" text-anchor="middle" font-size="20px" fill="#333">${percentage.toFixed(1)}%</text>
                </svg>
            </div>
            <p style="font-size: 24px;">${resultMessage}</p>
        `;

        // Dynamically set the stroke-dashoffset after the SVG is rendered
        const progressCircle = document.querySelector('.progress-circle');
        progressCircle.style.strokeDashoffset = circumference - progress;
    }
}

// .NET-related Questions
const questions = [
    { 
        title: "What is the primary framework for building web applications in .NET?", 
        answers: ["ASP.NET", "WPF", "WinForms", "Xamarin"], 
        correct: "ASP.NET" 
    },
    { 
        title: "Which of the following is used for dependency injection in .NET Core?", 
        answers: ["Singleton Pattern", "IServiceProvider", "Constructor Injection", "All of the above"], 
        correct: "All of the above" 
    },
    { 
        title: "What keyword is used to define a constant in C#?", 
        answers: ["const", "static", "readonly", "final"], 
        correct: "const" 
    },
    { 
        title: "In .NET, which class is the base class for all exceptions?", 
        answers: ["System.Object", "System.Exception", "System.Error", "System.BaseException"], 
        correct: "System.Exception" 
    },
    { 
        title: "Which method is used to configure middleware in an ASP.NET Core application?", 
        answers: ["ConfigureServices", "Configure", "Startup", "Main"], 
        correct: "Configure" 
    },
    { 
        title: "What is the purpose of LINQ in .NET?", 
        answers: ["Database Migration", "Querying Data", "File Handling", "Thread Management"], 
        correct: "Querying Data" 
    }
];

const quiz = new Quiz(questions);