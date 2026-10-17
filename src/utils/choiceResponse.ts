export async function saveFinalChoice(choice: string): Promise<void> {
  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ choice }),
  });

  if (!response.ok) {
    throw new Error('Não foi possível registrar a resposta.');
  }
}
