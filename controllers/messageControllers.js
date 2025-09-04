import React, { useState } from 'react';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';

function ChatBox({ chatId, messages }) {
  const [replyTo, setReplyTo] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchText) return;
    try {
      const { data } = await axios.get(`/api/message/search?chatId=${chatId}&searchText=${searchText}`);
      setSearchResults(data);
    } catch (err) {
      alert('Search failed');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied!');
  };

  const handleSend = () => {
    // TODO: Send newMessage and replyTo (if any) to backend
    setReplyTo(null);
    setNewMessage('');
  };

  const displayedMessages = searchResults.length > 0 ? searchResults : messages;

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <input
          type="text"
          placeholder="Search messages..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {searchResults.length > 0 && (
          <button onClick={() => { setSearchResults([]); setSearchText(''); }}>Clear</button>
        )}
      </div>
      <ScrollableChat messages={displayedMessages} chatId={chatId} onReply={setReplyTo} />
      {replyTo && (
        <div style={{ background: '#eee', padding: '4px', marginBottom: '4px' }}>
          Replying to: <b>{replyTo.content}</b>
          <button onClick={() => setReplyTo(null)} style={{ marginLeft: '8px' }}>Cancel</button>
        </div>
      )}
      <input
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatBox;
