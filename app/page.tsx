'use client';

import { generateId } from 'ai';
import { useChat } from 'ai/react';
import type { FunctionCallHandler, ChatRequest } from 'ai';

const functionCallHandler: FunctionCallHandler = async (
  chatMessages,
  functionCall,
) => {
  if (functionCall.name === 'get_current_weather') {
    if (functionCall.arguments) {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);
      // You now have access to the parsed arguments here (assuming the JSON was valid)
      // If JSON is invalid, return an appropriate message to the model so that it may retry?
      console.log(parsedFunctionCallArguments);
    }

    // Generate a fake temperature
    const temperature = Math.floor(Math.random() * (100 - 30 + 1) + 30);
    // Generate random weather condition
    const weather = ['sunny', 'cloudy', 'rainy', 'snowy'][
      Math.floor(Math.random() * 4)
    ];

    const functionResponse: ChatRequest = {
      messages: [
        ...chatMessages,
        {
          id: generateId(),
          name: 'get_current_weather',
          role: 'function' as const,
          content: JSON.stringify({
            temperature,
            weather,
            info: 'This data is randomly generated and came from a fake weather API!',
          }),
        },
      ],
    };
    return functionResponse;
  }
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    experimental_onFunctionCall: functionCallHandler
  });
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap my-2">
          <b>{m.role}</b><br />
          {typeof m.function_call === 'object' ?
            JSON.stringify(m.function_call) :
            (m.function_call ?? m.content)}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl bg-inherit"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
