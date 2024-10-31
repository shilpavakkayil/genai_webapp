import { useState } from "react";
import "./App.css";
import OpenAI from "openai";

function App() {
  const [query, setQuery] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [difficulty, setDifficulty] = useState("easy");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const handleQueryInputChange = (e) => {
    setQuery(e.target.value);
  };
  const handleNumQuestionsInputChange = (e) => {
    setNumQuestions(e.target.value);
  };
  const handleDifficultyInputChange = (e) => {
    setDifficulty(e.target.value);
  };

  const createQuestionsWithOpenAIApi = async () => {
    setIsLoading(true);

    const promptMessage = `Generate ${numQuestions} ${difficulty} questions with 4 options in an array format on the topic: ${query}. 
    
    Each question should be structured in JSON format with the following keys:
            - 'question': The text of the question.
            - 'options': An array of 4 options, each option as a string.
            - 'correct_option': The correct option (must match one of the options).
            - 'difficulty': The difficulty level of the question ('easy', 'medium', or 'hard').

            Output the result as an array of JSON objects with the structure described. Dont put anything else. Only valid Array.

            Example format:

            [
            {
                "question": "What is the capital of France?",
                "options": ["Paris", "London", "Berlin", "Rome"],
                "correct_option": "Paris",
                "difficulty": "easy"
            }
            ]
    `;

    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: promptMessage,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      setIsLoading(false);

      const response = chatCompletion?.choices[0]?.message?.content;
      const jsonoutput = JSON.parse(response);
      console.log(jsonoutput);
      setGeneratedQuestions(jsonoutput);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setGeneratedQuestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createQuestionsWithOpenAIApi();
  };

  console.log("Generated Questions", generatedQuestions);

  return (
    <div className="main-container">
      <h1>AI Question Generator</h1>
      <div className="form-container">
        <div>
          <label>Enter Query:</label>
          <input
            type="text"
            value={query}
            onChange={handleQueryInputChange}
            required
            placeholder="Enter a topic, subject or query..."
            className="query-input"
          />
        </div>

        <div>
          <label>Number of Questions: {numQuestions}</label>
          <input
            type="range"
            value={numQuestions}
            onChange={handleNumQuestionsInputChange}
            min="1"
            max="10"
            required
            className="no-of-questions-input"
          />
        </div>

        <div>
          <label>Select Difficulty:</label>
          <select
            value={difficulty}
            onChange={handleDifficultyInputChange}
            required
            className="difficulty-input"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="submit-button"
            onClick={handleSubmit}
          >
            {isLoading ? "Generating..." : "Generate Questions"}
          </button>
        </div>
      </div>

      <div>
        {generatedQuestions?.map(({ question, options }, i) => {
          return (
            <div key={i} className="question-list">
              <h4>{question}</h4>
              <ul>
                {options.map((option, idx) => {
                  return (
                    <li key={idx}>
                      {idx + 1}. {option}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;