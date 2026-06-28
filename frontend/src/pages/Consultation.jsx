import React, { useState, useEffect } from 'react';

export default function Consultation() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
    }
  }, [activeSessionId]);

  const fetchSessions = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/consultation/sessions/');
    const data = await res.json();
    setSessions(data);
    if (data.length > 0 && !activeSessionId) {
      setActiveSessionId(data[0].id);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/consultation/sessions/${id}/messages/`);
      const data = await res.json();
      
      if (data.length === 0) {
        setMessages([
          { sender: 'ai', text: 'Halo! Saya AI Beauty Consultant Hapsari. Ada masalah kulit atau rambut yang ingin kamu konsultasikan hari ini?' }
        ]);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
    }
  };

  const createNewChat = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/consultation/sessions/', { method: 'POST' });
    const newSession = await res.json();
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setMessages([{ sender: 'ai', text: 'Halo! Sesi baru telah dimulai. Silakan konsultasikan keluhanmu...' }]);
  };

  const deleteSession = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Apakah kamu yakin ingin menghapus riwayat konsultasi ini?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/consultation/sessions/${id}/messages/`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        const updatedSessions = sessions.filter(s => s.id !== id);
        setSessions(updatedSessions);
        
        if (activeSessionId === id) {
          if (updatedSessions.length > 0) {
            setActiveSessionId(updatedSessions[0].id);
          } else {
            setActiveSessionId(null);
            setMessages([{ sender: 'ai', text: 'Semua riwayat telah dihapus. Klik "New Chat +" untuk memulai konsultasi baru.' }]);
          }
        }
      }
    } catch (error) {
      console.error("Gagal menghapus sesi:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeSessionId) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/consultation/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: activeSessionId, message: userText }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
        const resSessions = await fetch('http://127.0.0.1:8000/api/consultation/sessions/');
        const dataSessions = await resSessions.json();
        setSessions(dataSessions);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Gagal memproses jawaban." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex bg-[#F9F6F5]">
      {/* SIDEBAR */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col p-4">
        <button onClick={createNewChat} className="w-full bg-[#1A1A1A] text-white py-3 rounded-md text-xs uppercase tracking-widest font-semibold hover:bg-[#D18C7E] transition mb-4">
          New Chat +
        </button>
        <div className="flex-grow overflow-y-auto flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-2">Riwayat Konsultasi</p>
          {sessions.map(s => (
            <div key={s.id} onClick={() => setActiveSessionId(s.id)} className={`p-3 text-sm rounded-md cursor-pointer transition flex justify-between items-center group/item ${activeSessionId === s.id ? 'bg-[#F5EBE8] text-[#D18C7E] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="truncate">💬 {s.title}</span>
              <button onClick={(e) => deleteSession(e, s.id)} className="text-gray-400 hover:text-red-500 font-bold px-1 text-xs opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT INTERFACE */}
      <div className="w-3/4 flex flex-col h-[750px] max-w-4xl mx-auto p-6">
        <div className="flex-grow bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col overflow-hidden">
          <div className="bg-[#D18C7E] text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-sm font-medium tracking-widest uppercase">Asisten Kecantikan Hapsari</h3>
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded">Stateful RAG</span>
          </div>

          <div className="flex-grow p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[75%] p-4 rounded-lg text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-[#1A1A1A] text-white self-end rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 self-start rounded-bl-none'}`}>
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }} />
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-gray-100 text-gray-400 p-4 rounded-lg self-start text-xs animate-pulse">
                Sedang menganalisis katalog produk Hapsari...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ceritakan kondisi kulit atau rambutmu..." className="flex-grow border border-gray-200 outline-none rounded-md px-4 py-3 text-sm focus:border-[#D18C7E] transition" disabled={isLoading} />
            <button type="submit" disabled={isLoading} className="bg-[#1A1A1A] text-white px-6 py-3 rounded-md text-xs uppercase tracking-widest font-bold hover:bg-[#D18C7E] transition disabled:opacity-50">
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}