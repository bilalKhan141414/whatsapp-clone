export const getElements = (e, msgId) => {
  const chatContainer = e
    ? e.target
    : document.getElementById("chat-container");
  const msgEleBounds = document.getElementById(msgId).getBoundingClientRect();

  const isMessageVisible = msgEleBounds.top < chatContainer.offsetHeight + 100;
  return {
    isMessageVisible,
    chatContainer,
    msgEleBounds,
  };
};

export const removeScrollEvent = (handleScroll) =>
  document
    .getElementById("chat-container")
    ?.removeEventListener("scroll", handleScroll);

export const addEventListenerById = (id, event, handler) =>
  document.getElementById(id)?.addEventListener(event, handler);

export const anyThingNotSmily = (str) => {
  for (var i = 0, n = str.length; i < n; i++) {
    if (str.charCodeAt(i) <= 255) {
      return true;
    }
  }
  return false;
};

export const checkForOnlySmily = (text) =>
  text.length <= 4 && !anyThingNotSmily(text);
