import { CactusLM, type Message } from 'cactus-react-native';
import { CONFIG } from '../constants/config';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const SYSTEM_PROMPT = `
You are VERDICT. You generate a forensic report of the user's phone usage.
Your output is immutable judgment.
Rules:
1. Written as a forensic report, not analytics.
2. No advice, no motivation, no humor, no emojis.
3. Tone: Institutional, cold, objective.
4. Max 180 words.
5. Formatting: Short paragraphs. Hard line breaks. No bullet points.
6. Verdict Line: One sentence, ALL CAPS, visually dominant.
7. Mean Language: Use absence framing ("You failed to...", "No progress was made").
`;

export const NarrativeEngine = {
    generateVerdict: async (metrics: any) => {
        try {
            // Try Local First
            console.log('Attempting local inference...');

            const modelPath = `${RNFS.DocumentDirectoryPath}/${CONFIG.MODELS.FILENAME}`;
            console.log('Model path:', modelPath);

            const exists = await RNFS.exists(modelPath);
            if (!exists) {
                console.log('Model file not found locally.');
                throw new Error('Model file not found');
            }

            const initResult = await CactusLM.init({
                model: modelPath,
                // We can set other params like n_ctx, etc.
            });

            if (initResult.error || !initResult.lm) {
                console.log('Cactus init failed:', initResult.error);
                throw initResult.error || new Error('CactusLM init returned null');
            }

            const cactusLM = initResult.lm;

            const prompt = `
          Metrics:
          Unlocks: ${metrics.unlocks}
          Session Duration: ${metrics.avgSessionDuration}s
          Top Apps: ${metrics.topApps.join(', ')}
          
          Generate the daily verdict.
          `;

            const messages: Message[] = [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ];

            const result = await cactusLM.completion(messages);
            return result.content;

        } catch (error) {
            console.log('Local inference failed (or disabled), falling back to Gemini', error);
            return await generateGeminiVerdict(metrics);
        }
    }
};

const generateGeminiVerdict = async (metrics: any) => {
    const prompt = `
  ${SYSTEM_PROMPT}
  
  Metrics:
  Unlocks: ${metrics.unlocks}
  Session Duration: ${metrics.avgSessionDuration}s
  Top Apps: ${metrics.topApps.join(', ')}
  
  Generate the daily verdict.
  `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        }
        throw new Error('Invalid Gemini response');
    } catch (e) {
        console.error('Gemini fallback failed', e);
        return "DATA CORRUPTED. NO VERDICT POSSIBLE.";
    }
};
