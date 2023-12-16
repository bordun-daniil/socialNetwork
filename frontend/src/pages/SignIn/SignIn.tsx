import { FC, ChangeEvent } from "react";
import { Link, Redirect } from "react-router-dom";
import { useInput } from "@/hooks";
import { SignInData } from "@/typing/entities";

interface SignInProps {
  isAuth: boolean;
  signIn: (payload: SignInData) => void;
}

const SignIn: FC<SignInProps> = ({ isAuth, signIn }) => {
  const {
    value: usernameValue,
    bind: usernameBind,
    reset: usernameReset,
  } = useInput();
  const {
    value: passwordValue,
    bind: passwordBind,
    reset: passwordReset,
  } = useInput();

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const payload = { username: usernameValue, password: passwordValue };
    signIn(payload);
    usernameReset();
    passwordReset();
  };

  if (isAuth) {
    return <Redirect to="/feed/" />;
  }

  return (
    <section className="sign-in__page">
      <div className="container">
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="circle-3"></div>
        <h2>Log in</h2>
        <form onSubmit={handleSubmit}>
          <input
            {...usernameBind}
            placeholder="Username or email"
            type="text"
            name="username"
            required
          />
          <input
            {...passwordBind}
            placeholder="Password"
            type="password"
            name="password"
            required
          />
          <button type="submit">Login</button>
          <Link to="/sign_up/">Create new account</Link>
        </form>
        <div className="circle-4"></div>
        <div className="circle-5"></div>
        <div className="circle-6"></div>
      </div>
    </section>
  );
};

export default SignIn;
