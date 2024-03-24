import { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [value, setValue] = useState("");
  const [message, setMeassage] = useState("");

  const getMessages = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: value,
        }),
      };

      const response = await fetch("http://localhost:8000/chatbot", options);
      const data = await response.json();
      console.log("Data received:", data);

      setMeassage(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createNewChat = () => {
    setMeassage("");
    setValue("");
    setTitle(null);
  };

  const handleClick = (uniqueChat) => {
    setTitle(uniqueChat);
    setMeassage("");
    setValue("");
  };

  useEffect(() => {
    if (!title && value && message) {
      setTitle(value);
    }
    if (title && value && message) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          title: title,
          role: "user",
          content: value,
        },
        {
          title: title,
          role: "assistant",
          content: message[0].content, // Access the first element of the array
        },
      ]);
    }
  }, [message, title]);

  const currentChats = prevChats.filter((chats) => chats.title === title);
  // console.log(currentChats);

  const uniqueChats = Array.from(
    new Set(prevChats.map((chats) => chats.title))
  );
  // console.log(uniqueChats);

  // console.log(prevChats);
  console.log("Message state:", message);

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          <li>
            {uniqueChats?.map((uniqueChat, index) => (
              <li key={index} onClick={() => handleClick(uniqueChat)}>
                {uniqueChat}
              </li>
            ))}
          </li>
        </ul>
        <nav>
          <p className="made-by">Made by Raj</p>
        </nav>
      </section>
      <section className="main">
        {!title && <h1>Apnabot</h1>}
        <ul className="feed">
          {/* {currentChats?.map((currentChat, index) => (
            <li key={index}>
              <p>{currentChat.role}</p>
              <p>{currentChat.content}</p>
            </li>
          ))} */}
          {currentChats?.map((currentChat, index) => (
            <li key={index}>
              <p className="role">{currentChat.role}</p>
              <p>{currentChat.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">
            Apnabot can make mistakes. Consider checking important information.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
