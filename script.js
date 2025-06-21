const questionList = document.getElementById('questionList');
const searchInput = document.getElementById('searchInput');
const questionForm = document.getElementById('questionForm');
const questionDetails = document.getElementById('questionDetails');
const right = document.querySelector(".right");
const newform = document.querySelector("#newform");
let questions = JSON.parse(localStorage.getItem('questions')) || [];


        localStorage.setItem('questions', JSON.stringify(questions));

        let selectedQuestionIndex = null;
let displayedQuestionIds = new Set();


function saveToLocalStorage() {
    localStorage.setItem('questions', JSON.stringify(questions));
}


function addQuestion(title, text) {
    const newId  = questions.length > 0 ? questions[questions.length - 1].id + 1 : 1;
   const question = { id: newId, title, text, responses: [] };
    questions.push(question);
    saveToLocalStorage();
    displayQuestions();
}

function appendQuestion(question) {
   if (!question || !question.id || displayedQuestionIds.has(question.id)) return;

    const li = document.createElement('li');
            li.textContent = question.title;
            li.style.cursor = 'pointer';
            li.id = `question-${question.id}`;
            li.dataset.id = question.id;
            li.addEventListener('click', () => {
                const index = questions.findIndex(q => q.id === question.id);
                if (index !== -1) {
                    selectedQuestionIndex = index;
                    showQuestionDetails(index);
                    
                    document.querySelectorAll('#questionList li').forEach(item => {
                        item.classList.remove('selected');
                    });
                    li.classList.add('selected');
                }
            });
             questionList.appendChild(li);
            displayedQuestionIds.add(question.id);

}

        function displayQuestions(filteredQuestions = questions) {
    const currentQuestionIds = new Set(
        filteredQuestions.map(q => q.id).filter(id => id !== undefined)
    );

    document.querySelectorAll('#questionList li').forEach(li => {
        const questionId = parseInt(li.dataset.id);
        if (!currentQuestionIds.has(questionId)) {
            li.remove();
        }
    });

    filteredQuestions.forEach(q => {
        if (q && q.id) {
            if (!document.getElementById(`question-${q.id}`)) {
                appendQuestion(q);
                displayedQuestionIds.add(q.id);
            } else {
                displayedQuestionIds.add(q.id);
            }
        }
    });
}


function showQuestionDetails(index) {
    right.style.visibility = "hidden";
    questionDetails.style.visibility = "visible";
    questionDetails.style.display = "block";
    const question = questions[index];
    questionDetails.innerHTML = `
        <p class="question-title">Question</p>
        <div class="question-info">
            <p class="question-title-text">${question.title}</p>  
            <p class="question-text">${question.text}</p>
        </div>
        <form id="responseForm" class="response-form">
            <input type="text" id="responseName" placeholder="Name" class="response-input" required>
            <textarea id="responseComment" placeholder="Comment" class="response-textarea" required></textarea>
            <button type="submit" class="response-submit">Submit Response</button>
        </form>
        <button onclick="resolveQuestion(${index})" class="resolve-button">Resolve</button>
        <button onclick="toggleResponses(${index})" class="toggle-responses-button">Show/Hide Responses</button>
        <div id="responseList" class="response-list" style="display: none;"></div>
    `;

    const responseForm = document.getElementById('responseForm');
    responseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const responseName = document.getElementById('responseName').value.trim();
        const responseComment = document.getElementById('responseComment').value.trim();

        if (responseName === '' || responseComment === '') {
            alert('Please write in both firlds');
            return;
        }

        addResponse(index, responseName, responseComment);
        responseForm.reset();
    });

    displayResponses(index);
}

function addResponse(index, name, comment) {
    questions[index].responses.push({ name, comment, likes: 0, dislikes:0 });
    saveToLocalStorage();
    displayResponses(index);
}

function displayResponses(index) {
    const responseList = document.getElementById('responseList');
    responseList.innerHTML = '';
   const sortedResponses = questions[index].responses.sort((a, b) => {
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
    });
    sortedResponses.forEach(response => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${response.name}:</strong> <p>${response.comment}</p>
            <button onclick="likeResponse(${index}, ${questions[index].responses.indexOf(response)})">👍 ${response.likes}</button>
            <button onclick="dislikeResponse(${index}, ${questions[index].responses.indexOf(response)})">👎 ${response.dislikes}</button>
        `;
        responseList.appendChild(div);
    });
}

function likeResponse(questionIndex, responseIndex) {
    questions[questionIndex].responses[responseIndex].likes++;
    saveToLocalStorage();
    displayResponses(questionIndex);
}

function dislikeResponse(questionIndex, responseIndex) {
    questions[questionIndex].responses[responseIndex].dislikes++;
    saveToLocalStorage();
    displayResponses(questionIndex);
}

function toggleResponses(index) {
    const responseList = document.getElementById('responseList');
    responseList.style.display = responseList.style.display === 'none' ? 'block' : 'none';
}

function resolveQuestion(index) {
    const questionId = questions[index].id;
            questions.splice(index, 1);
            saveToLocalStorage();
            
            const questionElement = document.querySelector(`#question-${questionId}`);
            if (questionElement) {
                questionElement.remove();
                displayedQuestionIds.delete(questionId);
            }
            
            selectedQuestionIndex = null;
            questionDetails.style.display = "none";
            right.style.display = "flex";
        }




const style = document.createElement('style');
style.textContent = `
    body {
        font-family: Arial, sans-serif;
        margin: 10px;
        padding: 0;
        box-sizing: border-box;
    }

    .selected {
        background-color: #e0e0e0;
    }

    .question-info {
        background: rgba(244, 234, 234, 0.628);
        padding: 20px;
        border-radius: 10px;
    }

    .question-title {
        font-size: 2rem;
        color: #333;
        margin: 0;
    }

    .question-title-text {
        font-size: 1.5rem;
        color: #333;
        margin: 0;
    }

    .question-text {
        font-size: 1.2rem;
        color: #666;
        margin: 0;
    }

    .response-form {
        margin-top: 20px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background: #f9f9f9;
    }

    .response-input {
        width: 100%;
        height: 40px;
        padding: 5px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    .response-textarea {
        width: 100%;
        height: 150px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        resize: vertical;
    }

    .response-submit {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .response-submit:hover {
        background-color: #45a049;
    }

    .resolve-button, .toggle-responses-button {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 10px;
    }

    .resolve-button:hover, .toggle-responses-button:hover {
        background-color: #0056b3;
    }

    .response-list {
        margin-top: 20px;
    }

    .response-list div {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    .response-list div:last-child {
        border-bottom: none;
    }
`;

displayQuestions();

document.head.appendChild(style);

newform.addEventListener('click', () => {
    right.style.visibility = "visible";
    questionDetails.style.display = "none";
});

questionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('questionTitle').value.trim();
    const text = document.getElementById('questionText').value.trim();

    if (title === '' || text === '') {
        alert('Please fill in both the title and text fields.');
        return;
    }

    addQuestion(title, text);
    questionForm.reset();
});
