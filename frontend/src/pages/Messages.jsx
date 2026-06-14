import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const fetchThread = async () => {
      try {
        const res = await api.get(`/messages/${selected.listing_id}`, {
          params: { with: selected.other_user_id }
        });
        setThread(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchThread();
    const interval = setInterval(fetchThread, 5000);
    return () => clearInterval(interval);
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      await api.post(`/messages/${selected.listing_id}`, {
        receiver_id: selected.other_user_id,
        content: newMsg
      });
      setNewMsg('');
      const res = await api.get(`/messages/${selected.listing_id}`, {
        params: { with: selected.other_user_id }
      });
      setThread(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
      <div className="bg-white rounded-xl shadow flex h-[70vh]">

        {/* Conversations List */}
        <div className="w-1/3 border-r overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No conversations yet</p>
          ) : (
            conversations.map((conv, i) => (
              <div key={i} onClick={() => setSelected(conv)}
                className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${selected?.listing_id === conv.listing_id && selected?.other_user_id === conv.other_user_id ? 'bg-blue-50' : ''}`}>
                <p className="font-semibold text-gray-800 text-sm truncate">{conv.listing_title}</p>
                <p className="text-xs text-gray-500 truncate">with {conv.other_user_name}</p>
                <p className="text-xs text-gray-400 truncate mt-1">{conv.last_message}</p>
              </div>
            ))
          )}
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="p-4 border-b bg-gray-50 rounded-tr-xl">
                <p className="font-semibold text-gray-800">{selected.listing_title}</p>
                <p className="text-xs text-gray-500">with {selected.other_user_name}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {thread.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender_id === user.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
                <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Type a message..." />
                <button type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;