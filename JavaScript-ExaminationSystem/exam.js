class Question {
    constructor(title, image, category, options, correctAnswer) {
        this.title = title;
        this.image = image;
        this.category = category;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
}

class Exam {
    constructor(questionsData) {
        this.questions = [];
        for (let i = 0; i < questionsData.length; i++) {
            const q = questionsData[i];
            this.questions.push(new Question(q.title, q.image, q.category, q.options, q.correctAnswer));
        }
        
        this.shuffledQuestions = this.shuffleArray([...this.questions]);
        this.currentQuestionIndex = 0;
        this.selectedAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.timeLeft = 200; 
        this.timer = null;
        
        this.setupEventListeners();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    setupEventListeners() {
        document.getElementById('next-btn').addEventListener('click', () => {
            if (this.currentQuestionIndex < this.shuffledQuestions.length - 1) {
                this.currentQuestionIndex++;
                this.displayQuestion();
            } else {
                this.showResults();
            }
        });
        
        const retryBtn = document.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => location.reload());
        }
    }
    
    startTimer() {
        const timerProgress = document.getElementById('timer-progress');
        const totalTime = 200; 
        
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            timerProgress.style.width = `${(this.timeLeft / totalTime) * 100}%`;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.showResults();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.querySelector('.timer-text').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateProgressCircle() {
        let answeredCount = 0;
        for (let i = 0; i < this.selectedAnswers.length; i++) {
            if (this.selectedAnswers[i] !== null) {
                answeredCount++;
            }
        }
        
        document.querySelector('.progress-text').textContent = 
            `${answeredCount}/${this.questions.length}`;
        
        const percentage = (answeredCount / this.questions.length) * 100;
        const progressPath = document.getElementById('progress-path');
        const pathLength = progressPath.getTotalLength();
        
        progressPath.style.strokeDasharray = pathLength;
        progressPath.style.strokeDashoffset = pathLength - (pathLength * percentage / 100);
    }
    
    displayQuestion() {
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        
        document.querySelector('.question-number').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.shuffledQuestions.length}`;
        document.querySelector('.question-category').textContent = question.category;
        
        document.getElementById('question-title').textContent = question.title;
        document.getElementById('question-image').src = question.image;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        const shuffledOptions = this.shuffleArray([...question.options]);
        for (let i = 0; i < shuffledOptions.length; i++) {
            const option = shuffledOptions[i];
            
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            
            if (this.selectedAnswers[this.currentQuestionIndex] === option) {
                button.classList.add('selected');
            }
            
            const exam = this; 
            button.addEventListener('click', function() {
                document.querySelectorAll('.option').forEach(opt => 
                    opt.classList.remove('selected'));
                
                this.classList.add('selected');
                exam.selectedAnswers[exam.currentQuestionIndex] = option;
                
                document.getElementById('next-btn').disabled = false;
                exam.updateProgressCircle();
            });
            
            optionsContainer.appendChild(button);
        }
        
        document.getElementById('next-btn').textContent = 
            this.currentQuestionIndex === this.shuffledQuestions.length - 1 ? 'Finish' : 'Next';
        
        document.getElementById('next-btn').disabled = 
            this.selectedAnswers[this.currentQuestionIndex] === null;
    }
    
    showResults() {
        clearInterval(this.timer);
        
        this.score = 0;
        for (let i = 0; i < this.shuffledQuestions.length; i++) {
            if (this.selectedAnswers[i] === this.shuffledQuestions[i].correctAnswer) {
                this.score++;
            }
        }
        
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('result-container').classList.remove('hidden');
        
        const percentage = (this.score / this.shuffledQuestions.length) * 100;
        document.getElementById('percentage').textContent = `${Math.round(percentage)}%`;
        
        document.getElementById('score-text').textContent = 
            `You answered ${this.score} out of ${this.shuffledQuestions.length} questions correctly`;
        
        const resultPath = document.getElementById('result-path');
        const pathLength = resultPath.getTotalLength();
        
        resultPath.style.strokeDasharray = pathLength;
        resultPath.style.strokeDashoffset = pathLength;
        
        setTimeout(() => {
            resultPath.style.strokeDashoffset = pathLength - (pathLength * percentage / 100);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }

    const studentName = localStorage.getItem('currentUserFullName');
    if (studentName) {
        document.querySelector('.username').textContent = studentName;
    } else {
        console.error("❌User not Exist!");
        document.querySelector('.username').textContent = "Student";
    }
    console.log("📌 Loaded Full Name:", studentName);

    const questionsData = [
        {
            title: "Which design pattern does ASP.NET Core Dependency Injection follow?",
            image: "https://example.com/aspnetcore1.jpg",
            category: "ASP.NET Core",
            options: ["Factory Pattern", "Singleton Pattern", "Strategy Pattern", "Mediator Pattern"],
            correctAnswer: "Factory Pattern"
        },
        {
            title: "What is the default return type of an ASP.NET Core Web API controller action?",
            image: "https://example.com/aspnetcore2.jpg",
            category: "ASP.NET Core Web API",
            options: ["IActionResult", "JsonResult", "ActionResult", "Object"],
            correctAnswer: "ActionResult"
        },
        {
            title: "Which EF Core method is used to apply pending migrations to the database?",
            image: "https://example.com/efcore1.jpg",
            category: "Entity Framework Core",
            options: ["Update-Migration", "Apply-Migrations", "Database.EnsureCreated()", "Database.Migrate()"],
            correctAnswer: "Database.Migrate()"
        },
        {
            title: "Which LINQ method is used for lazy loading of data?",
            image: "https://example.com/linq1.jpg",
            category: "LINQ",
            options: ["ToList()", "FirstOrDefault()", "AsQueryable()", "Include()"],
            correctAnswer: "AsQueryable()"
        },
        {
            title: "What HTTP method should be used to update an existing resource in Web API?",
            image: "https://example.com/webapi1.jpg",
            category: "Web API",
            options: ["GET", "POST", "PUT", "DELETE"],
            correctAnswer: "PUT"
        },
        {
            title: "Which C# keyword is used to define an asynchronous method?",
            image: "https://example.com/csharp1.jpg",
            category: "C#",
            options: ["async", "await", "task", "future"],
            correctAnswer: "async"
        },
        {
            title: "In ASP.NET Core MVC, where are the default route configurations defined?",
            image: "https://example.com/aspnetmvc1.jpg",
            category: "ASP.NET Core MVC",
            options: ["appsettings.json", "Startup.cs", "Program.cs", "Controllers folder"],
            correctAnswer: "Program.cs"
        },
        {
            title: "Which of the following is a valid LINQ query syntax?",
            image: "https://example.com/linq2.jpg",
            category: "LINQ",
            options: [
                "var result = from x in list select x;", 
                "var result = list select x;", 
                "var result = list where x == 10;", 
                "var result = list find x where x > 5;"
            ],
            correctAnswer: "var result = from x in list select x;"
        },
        {
            title: "Which EF Core method is used to load related data explicitly?",
            image: "https://example.com/efcore2.jpg",
            category: "Entity Framework Core",
            options: ["Include()", "Find()", "Load()", "ExplicitLoad()"],
            correctAnswer: "Load()"
        },
        {
            title: "Which database isolation level ensures that no other transaction can read or modify data until the current transaction completes?",
            image: "https://example.com/database1.jpg",
            category: "Databases",
            options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
            correctAnswer: "Serializable"
        }
    ];    
    const exam = new Exam(questionsData);
    exam.displayQuestion();
    exam.startTimer();
    exam.updateProgressCircle();
    
});