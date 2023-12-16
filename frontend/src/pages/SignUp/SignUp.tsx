import { FC, ChangeEvent } from "react";
import { Link, Redirect } from "react-router-dom";
import { useInput } from "@/hooks";
import { SignUpData } from "@/typing/entities";

interface SignUpProps {
  isAuth: boolean;
  signUp: (payload: SignUpData) => void;
  sendWarningMessageToAlert: (message: string) => void;
}

const SignUp: FC<SignUpProps> = ({
  isAuth,
  signUp,
  sendWarningMessageToAlert,
}) => {
  const {
    value: usernameValue,
    bind: usernameBind,
    reset: usernameReset,
  } = useInput();
  const { value: emailValue, bind: emailBind, reset: emailReset } = useInput();
  const {
    value: passwordValue,
    bind: passwordBind,
    reset: passwordReset,
  } = useInput();

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (passwordValue.length < 8) {
      sendWarningMessageToAlert(
        "Password length must be more then 8 characters"
      );
      return;
    }

    const payload = {
      username: usernameValue,
      email: emailValue,
      password: passwordValue,
    };

    signUp(payload);
    usernameReset();
    emailReset();
    passwordReset();
  };

  if (isAuth) return <Redirect to="/feed/" />;

  return (
    <section className="sign-up__page">
      <div className="container">
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <input
            {...usernameBind}
            type="text"
            name="username"
            placeholder="Username"
            required
          />
          <input
            {...emailBind}
            type="text"
            name="email"
            placeholder="Email"
            required
          />
          <input
            {...passwordBind}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button type="submit">Sign up</button>
          <Link to="/sign_in/">I'm already have account</Link>
        </form>
        <div className="circle-3"></div>
        <div className="circle-4"></div>
        <div className="circle-5"></div>
      </div>
    </section>
  );
};

export default SignUp;
