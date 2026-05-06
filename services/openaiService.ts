import { supabase } from './supabase';
import { AgreementTone, AgreementCategory } from '../types';

async function callAI(type: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: { type, ...params },
    });

    if (error) throw error;
    return data as Record<string, unknown>;
}

export async function getRuleSuggestions(commitment: string, tone: AgreementTone, category: AgreementCategory): Promise<string[]> {
    try {
        const data = await callAI('getRuleSuggestions', { commitment, tone, category });
        return (data.rules as string[]) ?? [];
    } catch (error) {
        console.error('Error fetching rules:', error);
        return ['Não foi possível gerar as regras agora. Tente novamente.'];
    }
}

export async function getPenaltySuggestions(commitment: string, tone: AgreementTone, category: AgreementCategory): Promise<string[]> {
    try {
        const data = await callAI('getPenaltySuggestions', { commitment, tone, category });
        return (data.penalties as string[]) ?? [];
    } catch (error) {
        console.error('Error fetching penalties:', error);
        return ['Não foi possível gerar as multas agora. Tente novamente.'];
    }
}

export async function generateAgreementTitle(commitment: string, tone: AgreementTone, category: AgreementCategory): Promise<string> {
    try {
        const data = await callAI('generateAgreementTitle', { commitment, tone, category });
        return (data.title as string) ?? `Acordo de ${category}`;
    } catch (error) {
        console.error('Error generating title:', error);
        return `Acordo de ${category}`;
    }
}

export async function generateDailyTip(): Promise<{ title: string; category: string; intro: string; steps: unknown[]; conclusion: string } | null> {
    try {
        const data = await callAI('generateDailyTip');
        return (data.tip as { title: string; category: string; intro: string; steps: unknown[]; conclusion: string }) ?? null;
    } catch (error) {
        console.error('Error generating daily tip:', error);
        return null;
    }
}
