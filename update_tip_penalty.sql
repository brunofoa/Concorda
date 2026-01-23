-- Update the 'conclusion' (A Multa) text for the tip titled "Você não é todo mundo"
-- We assume the 'content' column is a JSON string stored as TEXT.
-- We cast it to jsonb, update the 'conclusion' field, and cast back to text.

UPDATE tips
SET content = jsonb_set(
    content::jsonb,
    '{conclusion}',
    '"A Multa: Quem quebrar o acordo dá à outra parte o direito de escolher a próxima atividade em família (filme, jogo ou lanche)."'
)::text
WHERE title = 'Você não é todo mundo';
