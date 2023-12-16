import { ChangeEvent, FC, useEffect, useState } from "react";
import { UserLink } from "@/typing/entities";
import UserLinkComponent from "@/common/components/UserLinkComponent";

interface FriendsProps {
  friends: UserLink[];
}

const Friends: FC<FriendsProps> = ({ friends }) => {
  const [foundFriends, setFoundFriends] = useState([] as UserLink[]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const findFriend = (e: ChangeEvent<HTMLInputElement>) => {
    const result = friends.filter((friend) =>
      friend.username.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFoundFriends(result);
  };

  useEffect(() => setFoundFriends(friends), [friends]);

  return (
    <div className="friends-tab">
      <div className={"header " + (isSearchActive ? "search-active" : "")}>
        <h2>Friends</h2>
        <div
          className="search-icon"
          onClick={() => setIsSearchActive(!isSearchActive)}
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
          >
            <g>
              <g>
                <path
                  d="M217.711,239.229c-58.276,0-105.691,47.409-105.691,105.691v45.567h37.973V344.92c0-37.34,30.378-67.718,67.718-67.718
			c37.34,0,67.718,30.378,67.718,67.718v45.567h37.973V344.92C323.402,286.638,275.986,239.229,217.711,239.229z"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M217.711,105.058c-47.46,0-86.072,38.612-86.072,86.072c0,47.46,38.612,86.072,86.072,86.072s86.072-38.612,86.072-86.072
			C303.782,143.67,265.177,105.058,217.711,105.058z M217.711,239.229c-26.524,0-48.099-21.581-48.099-48.099
			c0-26.524,21.575-48.099,48.099-48.099s48.099,21.575,48.099,48.099C265.81,217.654,244.235,239.229,217.711,239.229z"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M215.179,0C96.527,0,0,96.527,0,215.179s96.527,215.179,215.179,215.179s215.179-96.527,215.179-215.179
			S333.832,0,215.179,0z M215.179,392.386c-97.71,0-177.206-79.496-177.206-177.206S117.469,37.973,215.179,37.973
			s177.206,79.496,177.206,177.206S312.89,392.386,215.179,392.386z"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M506.437,479.59L367.203,340.357c-7.417-7.417-19.429-7.417-26.847,0c-7.417,7.411-7.417,19.436,0,26.847L479.59,506.437
			c3.709,3.709,8.563,5.563,13.423,5.563c4.86,0,9.721-1.854,13.423-5.563C513.854,499.026,513.854,487.001,506.437,479.59z"
                />
              </g>
            </g>
          </svg>
        </div>
        <input type="text" onChange={findFriend} placeholder="Find friend" />
      </div>
      <div className="friends-list">
        {foundFriends ? (
          foundFriends?.map((friend) => (
            <UserLinkComponent key={friend.id} userLink={friend} />
          ))
        ) : (
          <h3 className="no-posts-message">no one is here yet</h3>
        )}
      </div>
    </div>
  );
};

export default Friends;
