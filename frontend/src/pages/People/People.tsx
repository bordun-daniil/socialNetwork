import { FC, useState } from "react";
import FriendsContainer from "./Friends/FriendsContainer";
import SearchContainer from "./Search/SearchContainer";

const People: FC = () => {
  const [activeLink, setActiveLink] = useState("friend");

  return (
    <section className="people__page">
      <div className="tabs">
        <button
          style={{
            color:
              activeLink === "friend" ? "var(--orange)" : "var(--light-grey)",
          }}
          onClick={() => setActiveLink("friend")}
        >
          Friends
        </button>
        <button
          style={{
            color:
              activeLink === "search" ? "var(--orange)" : "var(--light-grey)",
          }}
          onClick={() => setActiveLink("search")}
        >
          Search
        </button>
      </div>
      {activeLink === "friend" ? <FriendsContainer /> : <SearchContainer />}
    </section>
  );
};

export default People;
