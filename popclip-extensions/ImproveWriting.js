// #popclip extension for OpenAI Spelling&Grammar
// name: OpenAI Spelling&Grammar
// icon: "iconify:ic:round-fact-check"
// language: javascript
// module: true
// entitlements: [network]
// options: [{
//   identifier: apikey, label: API Key, type: string,
//   description: 'Obtain API key from OpenAI'
// }, 
// {
//    identifier: model, label: 'Model', type: multiple,
//    values:['gpt-4-turbo','gpt-4','gpt-3.5-turbo']
//  }, {
//   identifier: prompt, label: 'Spelling and Grammar Prompt', type: string,
//   defaultValue: "",
//   description: 'Enter the prompt template using {input} as a placeholder for the text'
// }]

const axios = require("axios");

async function generateContent(input, options) {
  let prompt;
  
  if (!options.prompt || options.prompt.trim().length === 0) {
    prompt="I will give you text content, you will rewrite it and output a better version of my text. Correct spelling, grammar, and punctuation errors in the given text. Keep the meaning the same. Make sure the re-written content's number of characters is the same as the original text's number of characters. Do not alter the original structure and formatting outlined in any way. Only give me the output and nothing else. Now, using the concepts above, re-write the following text. Respond in the same language variety or dialect of the following text:{input}";
  } else {
    prompt = options.prompt;
  }

  const userMessage = prompt.replace("{input}", input.text);

  const requestBody = {
    model: options.model,
    messages: [
      { role: "system", content: "You are an assistant that corrects grammar and spelling." },
      { role: "user", content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1.0
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${options.apikey}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating content:", error.response ? error.response.data : error.message);
    return "Error generating content: " + (error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

exports.actions = [{
  title: "OpenAI Improve Writing",
  after: "paste-result",
  code: async (input, options) => generateContent(input, options),
}];
