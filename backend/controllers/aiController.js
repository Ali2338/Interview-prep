const { GoogleGenAI } = require("@google/genai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicToFocus, numberOfQuestions } = req.body;

        if (!role || !experience || !topicToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: "Missing required feilds" });
        }

        const prompt = questionAnswerPrompt(role, experience, topicToFocus, numberOfQuestions);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        let rawText = response.text;

        const cleanText = rawText
            .replace(/^```json\s*/i, "") // remove starting ```json (case-insensitive)
            .replace(/^```\s*/i, "")     // also remove starting ``` if it's just that
            .replace(/```$/i, "")        // remove ending ```
            .trim();

        const data = JSON.parse(cleanText);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const generateConceptExplanations = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: "Missing required feilds" });
        }
        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        let rawText = response.text;

        const cleanText = rawText
            .replace(/^```json\s*/i, "") // remove starting ```json (case-insensitive)
            .replace(/^```\s*/i, "")     // also remove starting ``` if it's just that
            .replace(/```$/i, "")        // remove ending ```
            .trim();

        const data = JSON.parse(cleanText);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    generateInterviewQuestions,
    generateConceptExplanations
};