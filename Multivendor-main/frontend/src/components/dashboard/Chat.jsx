// src/components/Chat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai';
import { GrEmoji } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { FaList, FaPhoneAlt, FaInfoCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  add_friend,
  messageClear,
  send_message,
  updateMessage
} from '../../store/reducers/chatReducer';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';

const socket = io('https://multivendor-vp55.onrender.com');

const Chat = () => {
  const scrollRef = useRef();
  const bottomRef = useRef();
  const dispatch = useDispatch();
  const { sellerId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { fb_messages, currentFd, my_friends, successMessage } = useSelector(
    (state) => state.chat
  );

  const [text, setText] = useState('');
  const [receverMessage, setReceverMessage] = useState('');
  const [activeSeller, setActiveSeller] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // socket init
  useEffect(() => {
    if (!userInfo) return;
    socket.emit('add_user', userInfo.id, userInfo);
    socket.on('seller_message', (msg) => setReceverMessage(msg));
    socket.on('activeSeller', (sellers) => setActiveSeller(sellers));
    socket.on('typing', (data) => {
      if (data.senderId === sellerId) setIsTyping(data.status);
    });

    return () => {
      socket.off('seller_message');
      socket.off('activeSeller');
      socket.off('typing');
    };
  }, [userInfo, sellerId]);

  // Add friend
  useEffect(() => {
    if (userInfo && sellerId) {
      dispatch(add_friend({ sellerId: sellerId || '', userId: userInfo.id }));
    }
  }, [sellerId, dispatch, userInfo]);

  // Send message via socket
  useEffect(() => {
    if (successMessage && fb_messages.length) {
      socket.emit('send_customer_message', fb_messages[fb_messages.length - 1]);
      dispatch(messageClear());
    }
  }, [successMessage, fb_messages, dispatch]);

  // Receive message
  useEffect(() => {
    if (!receverMessage) return;
    if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
      dispatch(updateMessage(receverMessage));
    } else {
      toast.success(`${receverMessage.senderName} sent a message`);
      dispatch(messageClear());
    }
  }, [receverMessage, dispatch, sellerId, userInfo]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [fb_messages]);

  const send = () => {
    if (!text.trim()) return;
    dispatch(
      send_message({
        userId: userInfo.id,
        text,
        sellerId,
        name: userInfo.name
      })
    );
    setText('');
    setShowEmoji(false);
  };

  const onEmojiClick = (event, emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit('typing', { senderId: userInfo.id, receiverId: sellerId, status: !!e.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-white rounded-md shadow-md overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-white md:w-64 w-full md:h-auto fixed md:relative top-0 left-0 z-20 transition-all duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-12 border-b px-4 text-slate-600 font-semibold text-lg">
          <div className="flex items-center gap-2">
            <AiOutlineMessage /> Messages
          </div>
          <button className="md:hidden" onClick={() => setShowSidebar(false)}>
            ✕
          </button>
        </div>
        <div className="flex flex-col overflow-y-auto h-[calc(100vh-3rem)]">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search seller"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
          </div>
          {my_friends.map((f, i) => (
            <Link
              key={i}
              to={`/dashboard/chat/${f.fdId}`}
              className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 transition rounded-md"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                {activeSeller.some((c) => c.sellerId === f.fdId) && (
                  <span className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0 border border-white"></span>
                )}
              </div>
              <span className="truncate">{f.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {currentFd ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={currentFd.image}
                    alt={currentFd.name}
                    className="w-full h-full object-cover"
                  />
                  {activeSeller.some((c) => c.sellerId === currentFd.fdId) && (
                    <span className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0 border border-white"></span>
                  )}
                </div>
                <span className="font-medium text-slate-700">{currentFd.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition">
                  <FaPhoneAlt />
                </button>
                <button className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition">
                  <FaInfoCircle />
                </button>
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="md:hidden w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-md"
                >
                  <FaList />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 bg-slate-100">
              <div className="flex flex-col gap-3">
                {fb_messages.map((m, i) => {
                  const isSender = m.userId === userInfo.id;
                  return (
                    <div
                      key={i}
                      className={`flex gap-2 ${isSender ? 'justify-end' : 'justify-start'} items-end`}
                    >
                      {!isSender && (
                        <img
                          src="/images/user.png"
                          alt="user"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div
                        className={`p-2 rounded-2xl max-w-xs break-words text-white ${
                          isSender ? 'bg-cyan-500' : 'bg-purple-500'
                        } animate-fade-in relative`}
                      >
                        {m.message}
                        {m.timestamp && (
                          <div className="text-xs text-gray-200 mt-1">{m.timestamp}</div>
                        )}
                      </div>
                      {isSender && (
                        <img
                          src="/images/user.png"
                          alt="user"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                    <span className="text-sm text-gray-500">Typing...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t bg-white relative">
              <label className="w-10 h-10 flex items-center justify-center border rounded-full cursor-pointer hover:bg-slate-100 transition">
                <AiOutlinePlus />
                <input type="file" className="hidden" />
              </label>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={text}
                  onChange={handleTyping}
                  placeholder="Type a message"
                  className="w-full rounded-full h-10 px-4 outline-none border border-slate-300 pr-10 focus:ring-2 focus:ring-sky-400 transition"
                  onFocus={() => setShowEmoji(false)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <GrEmoji
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-slate-500 cursor-pointer"
                  onClick={() => setShowEmoji(!showEmoji)}
                />
                {showEmoji && (
                  <div className="absolute bottom-12 left-0 z-50">
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>

              <button
                onClick={send}
                className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"
              >
                <IoSend />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600 font-medium text-lg">
            Select Seller
          </div>
        )}
      </div>
    </div>
  );
};


export default Chat;
