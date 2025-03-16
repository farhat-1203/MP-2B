const messagesContainer = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const welcomeScreen = document.getElementById("welcomeScreen");

// Function to append messages
const appendMessage = (text, sender) => {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  // ✅ Use 'marked' to convert Markdown to HTML
  messageDiv.innerHTML = marked.parse(text);

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

// Function to send a message
const sendMessage = async () => {
  const input = chatInput.value.trim();
  if (!input) return;

  // Hide the welcome screen after the first message
  welcomeScreen.style.display = "none";
  appendMessage(`${input}`, "user");
  chatInput.value = "";

  // Add typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("typing-indicator");
  typingIndicator.textContent = "Typing...";
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    // Send request to Flask backend
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    // Handle network errors and incorrect responses
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    // Remove typing indicator
    typingIndicator.remove();

    // ✅ Check for valid response and parse Markdown properly
    if (data.response) {
      appendMessage(`\n\n${data.response}`, "bot");
    } else {
      appendMessage("**Error:** No response from the AI.", "bot");
    }
  } catch (error) {
    typingIndicator.remove();
    appendMessage(`**Error:** ${error.message}`, "bot");
  }
};

// Function to handle prompt selection
const selectPrompt = (prompt) => {
  chatInput.value = prompt;
  sendMessage();
};

// Event listeners for sending message and handling "Enter" key
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
