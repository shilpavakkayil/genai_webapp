
import { useState } from 'react'
import './App.css'
import OpenAI from 'openai';

function App() {
  const [query, setQuery] = useState("");
  const [questions, setQuestions] = useState([]);
  const [no_of_questions, setNoofQuestions] = useState(4);
  const [difficulty, setDifficulty] = useState("");
  const handleQueryChange = (e) =>{
    setQuery(e.target.value);
  };
  const handleNoofQuestionsChange = (e) =>{
    setNoofQuestions(e.target.value);
  };
  const handleDifficultyChange = (e) =>{
    setDifficulty(e.target.value);
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(query);
    console.log(no_of_questions);
    console.log(difficulty);
    createQuestionswithOpenaiapi();
  };
  const createQuestionswithOpenaiapi = async() =>{
    const promptMessage = `Generate ${no_of_questions} ${difficulty}  questions with
    Each question should be structured in JSON format with the following keys:
    - 'question': The text of the question.
    - 'options': An array of 4 options, each option as a string.
    - 'correct_option': The correct option (must match one of the options)
    - 'difficulty': The difficulty level of the question ('easy', 'medium', 'hard')
    Output the result as an array of JSON  objects with the structure described
    Example format:
    [
    {
    "question":"What is the capital of France?",
    "options": ["Paris","London","Berlin","Rome"],
    "correct_option":"Paris",
    "difficulty":"easy"
    }
    ]
    `;
    const openai  = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    try
    {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role:"user",
            content: promptMessage,
          },
        ],
        model: "gpt-4o-mini",
      });
      setIsLoading(false);
      const response = chatCompletion?.choices[0]?.message?.content;
      const jsonoutput = JSON.parse(response);
      console.log(questions);
      setNoofQuestions(questions);
    }
    catch(error)
    {
      console.error(error);
      setIsLoading = false;
      setNoofQuestions([]);
    }
  };
  return (
      <div className='main-container'>
        <h1>Gen AI App</h1>
        <div className='form-container'>
          <div>
            <label>Enter Query</label>
            <input type="text" className= "query-input" placeholder='Enter the query' onChange={handleQueryChange}/>
          </div>
          <div>
          <label>No of Questions:{no_of_questions}</label>
            <input type="range" min={1} max={10} className= "questions-input" onChange={handleNoofQuestionsChange}/>
          </div>
          <div>
            <label>Difficulty</label>
            <select className="difficulty-input" onChange={handleDifficultyChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button onClick={handleSubmit} className='submit-button'>
            {isLoading?"Generating...":"Generate Questions"}
            </button>
        </div>
        <div>
        {no_of_questions?.map(({question, options},i) => {
          return(
            <div key={i} className='question-list'>
              <h4>{question}</h4>
              <ul>
                {options.map((option,idx)=>{
                  return (<li key={idx}>{idx+1}.{option}</li>);
                })}
              </ul>
            </div>
          );
        })}
      </div>
      </div>
  );
}

export default App
