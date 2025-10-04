import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    const pat = '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'; // Replace with your actual PAT (e.g., ghp_...)
    console.log('Using PAT (first 10 chars):', pat.substring(0, 10) + '...');

    try {
      const res = await fetch('https://models.github.ai/inference/chat/completions', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${pat}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
          'User-Agent': 'MyGrokApp/1.0 (salmantoha11223@gmail.com)', // Replace with your email
        },
        body: JSON.stringify({
          model: 'xai/grok-3-mini',
          messages: [{ role: 'user', content: input }],
        }),
      });

      console.log('Response status:', res.status);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Error data:', errData);
        throw new Error(errData.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Full response:', data);
      setResponse(data.choices[0]?.message?.content || 'No response received');
    } catch (err) {
      setError('Error calling the API: ' + err.message);
      console.error('Full error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Grok-3-Mini Chat (GitHub Models)</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask Grok-3-Mini something... (e.g., What is the capital of France?)"
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Send'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h3>Grok-3-Mini's Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;