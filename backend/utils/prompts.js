const questionAnswerPrompt = ( role, experience ,topicToFocus,numberOfQuestions) =>(`
    You are an AI trained to generate technical interview questions and answers.
    
    Task:
    -Role: ${role}
    -Candidate Experience : ${experience}years
    -Focus Topic: ${topicToFocus}
    -Write ${numberOfQuestions} interview questions.
    -For each question, generate a detailed but beginner-friendly answer.
    -If the answer needs code examples, add a small code block inside.
    -Keep formatting very clean
    -Return a pure JSON array like:
    [
        {
            "question": "question here?",
            "answer": "answer here ."
        },
        ...
    ]
    Impoertant: Do not add any extra text. Only return the valid JSON .`
);

const conceptExplainPrompt = (question) =>(`
    You are an AI trained to generate a explanation for a given interview question.

    Task:
    -Explain the following interview question and its concept in depth as if you are teaching a biginner developer.
    -Question: ${question}
    -After the explanations, provide a clear and short title that summarizes the concept for the article or page header.
    -If the answer needs code examples, add a small code block inside.
    -Keep formatting very clean
    -Return the result as a valid JSON object in the following format:
        {
            "title": "short title her?",
            "explanation": "explanation here ."
        },
    
    Impoertant: Do not add any extra text outside the JSON format. Only return the valid JSON .
    `);

module.exports = {questionAnswerPrompt,conceptExplainPrompt};