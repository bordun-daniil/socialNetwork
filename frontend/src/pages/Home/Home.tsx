import { FC } from "react";
import { Link } from "react-router-dom";

const Home: FC = () => {
  return (
    <section className="home__page">
      <div className="container">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="info">
          <h1>Social Network</h1>
          <p>
            This social network is made for practice, learning and just for fun.
          </p>
          <h3>
            Github repo:
            <a href="https://github.com/Neon20179/socialNetwork/">
              socialNetwork
            </a>
          </h3>
          <a className="contact-me" href="mailto:neon20179.10@gmail.com">
            Contact me
          </a>
          <div className="links">
            <Link to="/sign_in/" className="base-button">
              Sign in
            </Link>
            <Link to="/sign_up/" className="base-button">
              Sign up
            </Link>
          </div>
        </div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
      </div>
    </section>
  );
};

export default Home;
