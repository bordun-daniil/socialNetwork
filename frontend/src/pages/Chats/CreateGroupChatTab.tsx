import { ChangeEvent, FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFriends, selectIsShowCreateGroupChatTab } from "@/selectors";
import { getFriends } from "@/state/friends";
import { useInput } from "@/hooks";
import { createGroupChat } from "@/state/chat";
import { toggleCreateGroupChatTab } from "@/state/components";

const CreateGroupChatTab: FC = () => {
  const isShowTab = useSelector(selectIsShowCreateGroupChatTab);
  const friends = useSelector(selectFriends);

  const dispatch = useDispatch();

  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [iconImageFile, setIconImageFile] = useState<any>(null);
  const [chatIconUrl, setChatIconUrl] = useState<any>("");

  const {
    value: chatName,
    bind: bindChatName,
    reset: resetChatName,
  } = useInput();

  const selectFriend = (friendId: number) => {
    if (selectedFriends.includes(friendId))
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    else setSelectedFriends([...selectedFriends, friendId]);
  };

  useEffect(() => {
    dispatch(getFriends(null));
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = isShowTab ? "hidden" : "unset";
  }, [isShowTab]);

  const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      const render = new FileReader();

      render.onload = (e) => {
        setChatIconUrl(e.target?.result);
      };

      render.readAsDataURL(image);
      setIconImageFile(image);
    }
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", chatName);
    formData.append("icon", iconImageFile);

    for (let idx = 0; idx < selectedFriends.length; idx++) {
      formData.append("users", String(selectedFriends[idx]));
    }

    resetChatName();
    setIconImageFile(null);
    setChatIconUrl("");

    dispatch(createGroupChat(formData));
    dispatch(toggleCreateGroupChatTab());
  };

  return (
    <div
      className="create-group-chat-tab"
      style={{ transform: isShowTab ? "unset" : `translateY(100%)` }}
    >
      <h2>Select friends</h2>
      <div className="friends-list">
        {friends?.map((friend) => (
          <div
            className="user-link"
            onClick={() => selectFriend(friend.id)}
            key={friend.id}
          >
            <div
              className="avatar-image"
              style={
                friend.avatar_image
                  ? { backgroundImage: `url(${friend.avatar_image})` }
                  : { background: "var(--orange)" }
              }
            ></div>
            <h4 className="username">{friend?.username}</h4>
            <div
              className="checkbox"
              style={{
                background: selectedFriends.includes(friend.id)
                  ? "var(--orange)"
                  : "var(--light-grey)",
              }}
            ></div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input {...bindChatName} required type="text" placeholder="Chat name" />
        <label className="chat-icon" htmlFor="chat-icon-input">
          <h4>Select icon</h4>
          <div className="load-icon">+</div>
          <input
            onChange={loadImage}
            id="chat-icon-input"
            type="file"
            accept="image/png, image/jpeg"
          />
          <div
            className="icon"
            style={{ backgroundImage: `url(${chatIconUrl})` }}
          ></div>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateGroupChatTab;
