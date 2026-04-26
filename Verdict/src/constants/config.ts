import {GEMINI_API_KEY as GEMINI_API_KEY_ENV} from '@env';

export const CONFIG = {
    GEMINI_API_KEY: GEMINI_API_KEY_ENV || '',
    MODELS: {
        LOCAL: 'google/functiongemma-270m-it',
        CLOUD: 'gemini-1.5-flash',
        DOWNLOAD_URL: 'https://huggingface.co/granskef/functiongemma-270m-it-GGUF/resolve/main/functiongemma-270m-it-Q4_K_M.gguf?download=true', // Example GGUF URL
        FILENAME: 'model.gguf',
    },
};
