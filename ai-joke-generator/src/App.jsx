import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend server
});

function App() {
  const [prompt, setPrompt] = useState('Select Parameters to Generate Prompt');
  const [joke, setJoke] = useState('');
  const [jokeType, setJokeType] = useState('');

  const generatePrompt = () => {
    const topic = document.querySelector('select[name="topic"]').value;
    const tone = document.querySelector('select[name="tone"]').value;
    const type = document.querySelector('select[name="type"]').value;
    const creativity = document.querySelector('select[name="creativity"]').value;

    const promptText = `Generate a ${type}, ${tone} joke regarding ${topic} and be as much ${creativity} as possible`;
    setPrompt(promptText);    
    // clear the joke and joke type
    setJoke('');
    setJokeType('');
  };

  // This function will generate a joke using the OpenAI API
  async function generateJoke() {
    console.log("generateJoke");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": `
                You are a super intelligent stand-up comedian who can create jokes instantly
                given any topic, tone, type, and creativity form. 
                Topics include work, people, animals, food, television, and sports.
                Tone options include witty, sarcastic, silly, dark, and goofy.
                Type options include one-liner, story, and knock-knock.
                And creativity options include random or creative.
                Your job is to generate a joke based on the selected parameters.                
                After telling the joke, you must classify it into one of these categories:
                Pun, Observational, Anti-joke, Word-play, Satire, or Dark humor.
                Respond in this format:
                Joke: [your joke here]
                Type: [joke type here]
              `
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": prompt
            }
          ]
        }
      ]
    });

    // Parse the response to separate joke and type
    const fullResponse = response.choices[0].message.content;
    const [jokeText, typeText] = fullResponse.split('\nType:');
    const generatedJoke = jokeText.replace('Joke:', '').trim();
    const generatedType = typeText.trim();

    setJoke(generatedJoke);
    setJokeType(generatedType);
    console.log(response);
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h3 className="text-3xl font-semibold text-center mb-8 text-indigo-400">
        Select Parameters for Joke
      </h3>
      
      <div className="space-y-6">
        {/* Topic Selection */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-xl">Topic:</label>
          <select name="topic" className="flex-1 p-2 rounded-md border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="work">Work</option>
            <option value="people">People</option>
            <option value="animals">Animals</option>
            <option value="food">Food</option>
            <option value="television">Television</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        {/* Tone Selection */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-xl">Tone:</label>
          <select name="tone" className="flex-1 p-2 rounded-md border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="witty">Witty</option>
            <option value="sarcastic">Sarcastic</option>
            <option value="silly">Silly</option>
            <option value="dark">Dark</option>
            <option value="goofy">Goofy</option>
          </select>
        </div>

        {/* Type Selection */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-xl">Type:</label>
          <select name="type" className="flex-1 p-2 rounded-md border border-indigo-200
             bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="oneliner">One-liner</option>
            <option value="story">Story</option>
            <option value="knock-knock">Knock-knock</option>
          </select>
        </div>

        {/* Random/Creative Selection */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-xl">Creativity:</label>
          <select name="creativity" className="flex-1 p-2 rounded-md border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="random">Random</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {/* Buttons and Results Section */}
        <div className="space-y-4 mt-8">
          {/* Generate Prompt Row */}
          <div className="flex gap-4 items-center">
            <button 
              className="w-48 bg-indigo-400 text-white py-3 rounded-md
               hover:bg-indigo-500 transition-colors"
              onClick={generatePrompt}
            >
              Generate Prompt
            </button>
            <textarea type="text" readOnly value={prompt}
              className="flex-1 p-2 rounded-md border border-indigo-200
               bg-gray-100"
            />
          </div>
          
          {/* Generate Joke Row */}
          <div className="flex gap-4 items-center">
            <button className="w-48 bg-indigo-400 text-white py-3 rounded-md
               hover:bg-indigo-500 transition-colors"
               onClick={generateJoke}
               >
              Generate Joke
            </button>
            <textarea readOnly value={joke} className="flex-1 p-2 h-24 rounded-md border
               border-indigo-200 bg-gray-100"              
            />
          </div>
          
          {/* Joke Type Row */}
          <div className="flex gap-4 items-center">
            <div className="w-48 bg-indigo-400 text-white py-3 rounded-md text-center">
              Joke Type (AI generated)
            </div>
            <input 
              type="text" 
              readOnly 
              value={jokeType}
              className="flex-1 p-2 rounded-md border border-indigo-200 bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
