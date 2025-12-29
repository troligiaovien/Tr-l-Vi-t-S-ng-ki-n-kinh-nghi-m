import React, { useState } from 'react';
import { geminiService } from './services/geminiService';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await geminiService.generateSKKNContent(input);
      setResponse(result);
    } catch (error) {
      setResponse("Có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra API Key.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Hỗ trợ viết Sáng kiến kinh nghiệm</h1>
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập ý tưởng hoặc tên đề tài tại đây..."
        style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '10px' }}
      />
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {loading ? 'Đang xử lý...' : 'Tạo nội dung'}
      </button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1 - solid #ddd' }}>
        {response}
      </div>
    </div>
  );
}

export default App;
