
import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

// Log initialization status for debugging
console.log('Available Env Keys:', Object.keys(import.meta.env));
if (!apiKey) {
    console.error('OpenAI API Key is missing! Check your .env.local file and restart the server.');
} else {
    console.log('OpenAI Service initialized. Key present.');
}

const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key', // Prevent crash on init if missing, but calls will fail
    dangerouslyAllowBrowser: true
});

import { AgreementTone, AgreementCategory } from '../types';

export async function getRuleSuggestions(commitment: string, tone: AgreementTone, category: AgreementCategory): Promise<string[]> {
    if (!apiKey) {
        console.error("Attempted to call OpenAI without an API Key.");
        return ["Erro: Chave API ausente.", "Verifique o arquivo .env.local", "Reinicie o servidor."];
    }

    try {
        let systemPrompt = "Você está redigindo cláusulas contratuais operacionais. Uma regra define O QUE deve ser feito, COMO deve ser feito e ONDE. NÃO sugira punições, dancinhas ou poemas. Foque na execução da tarefa.";

        // Category specific instruction
        switch (category) {
            case 'Financeiro':
                systemPrompt += " Seja pragmático, numérico e focado em prazos e valores.";
                break;
            case 'Casais':
                systemPrompt += " Foque na convivência harmônica e acordos de relacionamento.";
                break;
            case 'Amigos':
                systemPrompt += " Permita um tom mais descontraído e de zoeira, se o tom pedir.";
                break;
            case 'Casa':
                systemPrompt += " Foque em organização, limpeza e responsabilidades domésticas.";
                break;
            case 'Família':
                systemPrompt += " Foque em respeito mútuo, horários e hierarquia ou colaboração.";
                break;
        }

        let userPrompt = "";

        switch (tone) {
            case 'Neutro':
                systemPrompt += " Seja formal e direto. Ex: 'A louça deve ser lavada imediatamente após o uso, sem exceções.'";
                break;
            case 'Divertido':
                systemPrompt += " Use metáforas engraçadas, mas exigindo qualidade. Ex: 'A pia deve brilhar a ponto de o gato conseguir se ver no reflexo. Zero gordura permitida.'";
                break;
            case 'Ácido':
                systemPrompt += " Seja passivo-agressivo e antecipe desculpas preguiçosas. Ex: 'Deixar de molho é proibido; água fria não é desculpa. Lavou, secou, guardou.'";
                break;
        }

        userPrompt = `O acordo é sobre: "${commitment}". Categoria: ${category}. Sugira 3 regras operacionais para este contexto. Retorne APENAS um JSON válido no formato: { "rules": ["Regra 1", "Regra 2", "Regra 3"] }.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        console.log("OpenAI Rules Response:", content); // Debug log

        if (!content) throw new Error("Empty response from OpenAI");

        const parsed = JSON.parse(content);

        // Robust parsing
        if (parsed.rules && Array.isArray(parsed.rules)) return parsed.rules;
        if (Array.isArray(parsed)) return parsed;

        // Fallback if structure is different
        const values = Object.values(parsed).flat().filter(v => typeof v === 'string') as string[];
        if (values.length > 0) return values.slice(0, 3);

        return ["IA não retornou o formato esperado.", "Tente novamente.", "Verifique o console."];

    } catch (error: any) {
        console.error("Error fetching rules from OpenAI:", error);

        // Return more specific errors if possible
        if (error?.status === 401) return ["Erro de Autenticação.", "Verifique sua API Key.", "Reinicie o servidor."];
        if (error?.status === 429) return ["Muitas requisições.", "Tente novamente em breve.", "Limite excedido."];

        return ["Erro ao conectar com IA.", "Tente novamente mais tarde.", "Verifique sua conexão."];
    }
}

export async function getPenaltySuggestions(commitment: string, tone: AgreementTone, category: AgreementCategory): Promise<string[]> {
    if (!apiKey) {
        console.error("Attempted to call OpenAI without an API Key.");
        return ["Erro: Chave API ausente.", "Verifique o arquivo .env.local", "Reinicie o servidor."];
    }

    try {
        const toneInstruction = {
            'Divertido': 'divertidas e leves (ex: pagar um sorvete)',
            'Ácido': 'humilhantes de forma engraçada ou sarcásticas (ex: postar uma foto feia)',
            'Neutro': 'práticas e justas (ex: pagar o valor excedente)'
        }[tone];

        const prompt = `Para o combinado "${commitment}" (Categoria: ${category}), sugira 3 multas simbólicas seguindo um tom ${toneInstruction}. Retorne APENAS um JSON válido no formato: { "penalties": ["Multa 1", "Multa 2", "Multa 3"] }.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that outputs JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        console.log("OpenAI Penalties Response:", content); // Debug log

        if (!content) throw new Error("Empty response from OpenAI");

        const parsed = JSON.parse(content);

        if (parsed.penalties && Array.isArray(parsed.penalties)) return parsed.penalties;
        if (parsed.multas && Array.isArray(parsed.multas)) return parsed.multas;
        if (Array.isArray(parsed)) return parsed;

        // Fallback
        const values = Object.values(parsed).flat().filter(v => typeof v === 'string') as string[];
        if (values.length > 0) return values.slice(0, 3);

        return ["IA não retornou o formato esperado.", "Tente novamente.", "Verifique o console."];

    } catch (error: any) {
        console.error("Error fetching penalties from OpenAI:", error);

        if (error?.status === 401) return ["Erro de Autenticação.", "Verifique sua API Key.", "Reinicie o servidor."];
        if (error?.status === 429) return ["Muitas requisições.", "Tente novamente em breve.", "Limite excedido."];

        return ["Erro ao conectar com IA.", "Tente novamente mais tarde.", "Verifique sua conexão."];
    }
}

export async function generateAgreementTitle(commitment: string, tone: AgreementTone, category: AgreementCategory): Promise<string> {
    if (!apiKey) return `Acordo de ${category}`; // Fallback

    try {
        const systemPrompt = "Você é um criador de nomes criativos para contratos.";

        let userPrompt = `Crie um título curto para um acordo sobre: "${commitment}". Categoria: ${category}.`;

        switch (tone) {
            case 'Neutro':
                userPrompt += " Regra de Tom: Neutro. Crie um título formal e descritivo. (Ex: 'Acordo de Manutenção da Limpeza').";
                break;
            case 'Divertido':
                userPrompt += " Regra de Tom: Divertido. Use trocadilhos, humor leve e emojis. (Ex: 'Operação Pia Limpa 🧼' ou 'A Saga da Toalha Molhada').";
                break;
            case 'Ácido':
                userPrompt += " Regra de Tom: Ácido. Seja sarcástico e use ironia fina. (Ex: 'Milagre da Louça Lavada' ou 'Espero que Dessa Vez Vá').";
                break;
        }

        userPrompt += " Saída: Retorne APENAS o título, sem aspas.";

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 60,
        });

        let title = response.choices[0].message.content?.trim();
        // Remove surrounding quotes if they exist
        if (title) {
            title = title.replace(/^["']+|["']+$/g, '');
        }
        return title || `Acordo de ${category}`;

    } catch (error) {
        console.error("Error generating title:", error);
        return `Acordo de ${category}`;
    }
}

export async function generateDailyTip(): Promise<{ title: string, category: string, intro: string, steps: any[], conclusion: string } | null> {
    if (!apiKey) return null;

    try {
        const systemPrompt = "Você é um especialista em convivência harmoniosa e divertida. Retorne APENAS um JSON válido.";
        const userPrompt = `Gere uma dica curta, leve e educativa sobre convivência (roommates, casais ou amigos). 
        Retorne estritamente um JSON com esta estrutura:
        {
          "category": "Tag curta (ex: Convivência)",
          "title": "Título criativo com 1 Emoji",
          "intro": "Uma frase introdutória envolvente de até 2 linhas.",
          "steps": [
            { "id": "01", "bold": "Título do passo:", "text": "Explicação curta." },
            { "id": "02", "bold": "Título do passo:", "text": "Explicação curta." },
            { "id": "03", "bold": "Título do passo:", "text": "Explicação curta." }
          ],
          "conclusion": "Frase final de impacto curta."
        }
        Seja sempre educativo, leve e formate os passos exatamente assim.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 400,
        });

        const content = response.choices[0].message.content;
        if (!content) return null;

        return JSON.parse(content);
    } catch (error) {
        console.error("Error generating daily tip:", error);
        return null;
    }
}
