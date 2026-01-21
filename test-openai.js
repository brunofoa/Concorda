
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manually parse .env.local because we might not have 'dotenv' installed
const envPath = path.resolve(__dirname, '.env.local');
let apiKey = process.env.VITE_OPENAI_API_KEY;

if (fs.existsSync(envPath)) {
    console.log(`Reading .env.local from: ${envPath}`);
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const parts = trimmed.split('=');
            const key = parts[0].trim();
            // Join the rest back in case the value has '=' signs
            let val = parts.slice(1).join('=').trim();
            // Remove quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            if (key === 'VITE_OPENAI_API_KEY') {
                apiKey = val;
            }
        }
    }
}

console.log('---------------------------------------------------');
console.log('Testing OpenAI API Key...');
console.log('Key found:', apiKey ? 'YES (Length: ' + apiKey.length + ')' : 'NO');
console.log('---------------------------------------------------');

if (!apiKey) {
    console.error('ERROR: VITE_OPENAI_API_KEY is missing in .env.local');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: apiKey,
});

async function testConnection() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Hello, are you working?" }],
            max_tokens: 10,
        });
        console.log('SUCCESS! OpenAI responded:');
        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error('FAILURE! Could not connect to OpenAI.');
        console.error('Error details:', error.message);
        if (error.status) console.error('Status Code:', error.status);
        if (error.code) console.error('Error Code:', error.code);
    }
}

testConnection();
