export const handleKey = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") {
    console.log("arrowDown");
    e.preventDefault();

    arrowDown();
    return;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    arrowUp();
    return;
  }
  if (e.key === "Enter") {
    e.preventDefault();

    if (messages[msgIndex]?.status === "ARCHIVED") return;
    // if (messages[msgIndex].answer?.status === "PUBLISHED") return;
    if (isTrainBot) {
      console.log("navigate to train");
      navigate("/train");
      return;
    }
    if (isAlertPublishOpen) {
      (async () => {
        await publish();
      })();
      setIsAlertPublishOpen(false);
      return;
    }
    if (focusedAnswerId !== "" && focusedId !== "") {
      setIsAlertPublishOpen(true);
      return;
    }
    setFocusedAnswerId(messages[msgIndex].messageId);
    setKeyState("Enter");
    return;
  }
  if (e.key === "Escape") {
    e.preventDefault();
    setIsAlertPublishOpen(false);
    if (focusedAnswerId !== "") {
      setFocusedAnswerId("");
      (async () => {
        await updateAnswer();
      })();
      setFocusedId(messages[msgIndex].messageId);
    } else if (
      keyState === "ArrowDown" ||
      keyState === "ArrowUp" ||
      keyState === "Escape"
    ) {
      setFocusedAnswerId("");
      setFocusedId("");
    }
    setKeyState("Escape");
    return;
  }
  if (e.key === "Tab") {
    e.preventDefault();
    (async () => {
      await generate();
    })();
    return;
  }
  if (e.key === "a") {
    if (focusedAnswerId === "" && focusedId !== "") {
      e.preventDefault();
      (async () => {
        await archive();
      })();
    }
    return;
  }
  if (e.key === "u") {
    if (focusedAnswerId === "" && focusedId !== "") {
      e.preventDefault();
      (async () => {
        await unarchive();
      })();
    }
    return;
  }
  if (e.key === "r") {
    if (focusedAnswerId === "" && focusedId !== "") {
      e.preventDefault();
      const msg = messages.filter((m) => m.messageId === focusedId)[0];
      if (msg.status === "OPPORTUNITY") {
        (async () => {
          await nonrelevant();
        })();
      } else {
        (async () => {
          await relevant();
        })();
      }
    }
    return;
  }
};

const arrowDown = () => {
  if (msgIndex === messages.length - 1) return;
  if (focusedAnswerId !== "") {
    setFocusedAnswerId("");
    (async () => {
      await updateAnswer();
    })();
  }
  setFocusedAnswerId("");
  setFocusedId((messages[msgIndex + 1] as MessageType).messageId);

  setIndex((currentIndex) => currentIndex + 1);
  setKeyState("ArrowDown");
  if (msgIndex > 0) {
    setMsgs([...messages.slice(msgIndex, msgIndex + 6)]);
  }
};

const arrowUp = () => {
  if (msgIndex < 1) return;
  if (focusedAnswerId !== "") {
    setFocusedAnswerId("");
    (async () => {
      await updateAnswer();
    })();
  }
  setFocusedAnswerId("");
  setFocusedId(messages[msgIndex - 1].messageId);

  setIndex((currentIndex) => currentIndex - 1);
  setKeyState("ArrowUp");
  if (msgIndex < 2) {
    setMsgs([...messages.slice(0, messages.length > 6 ? 6 : messages.length)]);
  } else {
    setMsgs([...messages.slice(msgIndex - 1, msgIndex + 5)]);
  }
};
const archive = async () => {
  try {
    const id = messages[msgIndex].messageId;
    const newMsgs = msgs.map((m) => {
      if (m.messageId === id) {
        return {
          ...m,
          answer: m.answer,
        };
      } else {
        return m;
      }
    });
    setMsgs(newMsgs);

    const formData = new FormData();
    formData.append("creationDate", String(messages[msgIndex].creationDate));
    formData.append("button", "ARCHIVE");
    formData.append("id", community.communityId);
    fetcher.submit(formData, { method: "post" });
  } catch (error) {
    console.log("error archiving", error);
  }
};

const unarchive = async () => {
  try {
    const id = messages[msgIndex].messageId;
    const newMsgs = msgs.map((m) => {
      if (m.messageId === id) {
        return {
          ...m,
          answer: m.answer,
        };
      } else {
        return m;
      }
    });
    setMsgs(newMsgs);

    const formData = new FormData();
    formData.append("creationDate", messages[msgIndex].creationDate);
    formData.append("button", "UNARCHIVE");
    formData.append("id", community.communityId);
    fetcher.submit(formData, { method: "post" });
  } catch (error) {
    console.log("error archiving", error);
  }
};

const relevant = async () => {
  try {
    const id = messages[msgIndex].messageId;
    const newMsgs = msgs.map((m) => {
      if (m.messageId === id) {
        return {
          ...m,
          opportunity: true,
        };
      } else {
        return m;
      }
    });
    setMsgs(newMsgs);

    const formData = new FormData();
    formData.append("creationDate", messages[msgIndex].creationDate);
    formData.append("button", "RELEVANT");
    formData.append("id", community.communityId);
    fetcher.submit(formData, { method: "post" });
  } catch (error) {
    console.log("error archiving", error);
  }
};

const nonrelevant = async () => {
  try {
    const id = messages[msgIndex].messageId;
    const newMsgs = msgs.map((m) => {
      if (m.messageId === id) {
        return {
          ...m,
          opportunity: false,
        };
      } else {
        return m;
      }
    });
    setMsgs(newMsgs);

    const formData = new FormData();
    formData.append("creationDate", messages[msgIndex].creationDate);
    formData.append("button", "NONRELEVANT");
    formData.append("id", community.communityId);
    fetcher.submit(formData, { method: "post" });
  } catch (error) {
    console.log("error archiving", error);
  }
};

const updateAnswer = async () => {
  const msg: MessageType = msgs.filter((m) => m.messageId === focusedId)[0];
  const answer = msg.answer;
  if (!msg) return;
  try {
    const formData = new FormData();
    formData.append("creationDate", msg.creationDate);
    formData.append("button", "UPDATE_ANSWER");
    formData.append("answer", String(answer));
    fetcher.submit(formData, { method: "post" });
  } catch (error) {
    console.log("error updatingAnswer", error);
  }
};

const publish = async () => {
  console.log("publish");
  try {
    const id = messages[msgIndex].messageId;
    const newMsgs: MessageType[] = msgs.map((m) => {
      if (m.messageId === id) {
        return {
          ...m,
          status: "PUBLISHING",
          // thread: [...m.thread],
        };
      } else {
        return m;
      }
    });
    setMsgs(newMsgs);
    setIsAlertPublishOpen(false);
    const newMsg = newMsgs.filter((m) => m.messageId === id)[0];
    if (!newMsg) throw new Error("no message found");
    const formData = new FormData();
    formData.append("creationDate", newMsg.creationDate);
    formData.append("answer", String(newMsg.answer));
    formData.append("button", "PUBLISH");
    fetcher.submit(formData, { method: "post" });
  } catch (error) {
    console.log("error publishing", error);
    throw error;
  }
};

const generate = async () => {
  if (community.settings.traininng.status !== "TRAINED") {
    setTrainBot(true);
    return;
  }

  try {
    const id = messages[msgIndex].messageId;
    const newMsgs: MessageType[] = msgs.map((m) => {
      if (m.messageId === id) {
        return {
          ...m,
          status: "GENERATING",
        };
      } else {
        return m;
      }
    });
    setMsgs(newMsgs);

    const newMsg = newMsgs.filter((m) => m.messageId === id)[0];
    if (!newMsg) throw new Error("no message found");
    const formData = new FormData();
    formData.append("creationDate", newMsg.creationDate);
    formData.append("answer", String(newMsg.answer?.message));
    formData.append("button", "GENERATE");
    formData.append("id", community.communityId);
    fetcher.submit(formData, { method: "post" });
  } catch (error) {
    console.log("error archiving", error);
  }
};

const clickSelect = (id: string) => {
  setFocusedAnswerId(id);
  setFocusedId(id);
};

const back = () => {
  setFocusedAnswerId("");
  setFocusedId("");
};
