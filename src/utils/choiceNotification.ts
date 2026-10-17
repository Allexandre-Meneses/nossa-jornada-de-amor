export async function notifyFinalChoice(choice: string): Promise<void> {
  const response = await fetch('/api/notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ choice }),
  });

  if (!response.ok) {
    throw new Error('Não foi possível enviar a resposta.');
  }
}
