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

  if (loading) return <div className="text-center py-20 text-ink/40 italic">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="font-serif text-3xl text-ink mb-8">Messages</h2>
      <div className="border border-sand rounded-md flex h-[70vh] overflow-hidden">

        {/* Conversations List */}
        <div className="w-1/3 border-r border-sand overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-center text-ink/40 italic py-10 text-sm px-4">No conversations yet</p>
          ) : (
            conversations.map((conv, i) => (
              <div key={i} onClick={() => setSelected(conv)}
                className={`p-4 cursor-pointer border-b border-sand transition-colors ${selected?.listing_id === conv.listing_id && selected?.other_user_id === conv.other_user_id ? 'bg-clay/5' : 'hover:bg-sand/30'}`}>
                <p className="font-medium text-ink text-sm truncate">{conv.listing_title}</p>
                <p className="text-xs text-ink/50 truncate mt-0.5">with {conv.other_user_name}</p>
                <p className="text-xs text-ink/35 truncate mt-1 italic">{conv.last_message}</p>
              </div>
            ))
          )}
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-ink/40 text-sm italic">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-sand bg-sand/20">
                <p className="font-medium text-ink">{selected.listing_title}</p>
                <p className="text-xs text-ink/50">with {selected.other_user_name}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {thread.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-sm text-sm ${msg.sender_id === user.id ? 'bg-ink text-paper' : 'bg-sand/40 text-ink'}`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-paper/60' : 'text-ink/40'}`}>
                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={handleSend} className="p-4 border-t border-sand flex gap-2">
                <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 bg-transparent border border-sand rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-clay transition-colors"
                  placeholder="Type a message..." />
                <button type="submit"
                  className="bg-ink text-paper px-4 py-2 rounded-sm text-xs uppercase tracking-wide hover:bg-clay transition-colors">
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
