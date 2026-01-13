
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
console.log('Gemini Service initialized. Key length:', apiKey.length);
const ai = new GoogleGenAI({ apiKey });

export type AgreementTone = 'Divertido' | 'Ácido' | 'Neutro';

export async function getRuleSuggestions(commitment: string, tone: AgreementTone): Promise<string[]> {
  try {
    const toneInstruction = {
      'Divertido': 'engraçadas, leves e amigáveis',
      'Ácido': 'sarcásticas, irônicas e diretas (mas ainda seguras para amigos)',
      'Neutro': 'formais, claras e objetivas'
    }[tone];

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Você é um mediador especialista em acordos criativos e resolução de conflitos. O usuário está criando um acordo sobre: "${commitment}". Sua tarefa é sugerir 3 regras específicas, não-óbvias e levemente divertidas ou profundas para esse contexto. O tom deve ser: ${toneInstruction}. Evite clichês como "respeito" ou "clareza". Exemplo ruim: "Não se atrase". Exemplo bom (para um acordo de viagem): "Quem dirige escolhe a música, sem reclamações dos passageiros". Gere as 3 opções em formato JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error fetching rules:", error);
    return ["Erro ao conectar com IA.", "Tente novamente mais tarde.", "Verifique sua conexão."];
  }
}

export async function getPenaltySuggestions(commitment: string, tone: AgreementTone): Promise<string[]> {
  try {
    const toneInstruction = {
      'Divertido': 'divertidas e leves (ex: pagar um sorvete)',
      'Ácido': 'humilhantes de forma engraçada ou sarcásticas (ex: postar uma foto feia)',
      'Neutro': 'práticas e justas (ex: pagar o valor excedente)'
    }[tone];

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Para o combinado "${commitment}", sugira 3 multas simbólicas seguindo um tom ${toneInstruction}. Retorne apenas um array JSON de strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error fetching penalties:", error);
    return ["Erro ao conectar com IA.", "Tente novamente mais tarde.", "Verifique sua conexão."];
  }
}
