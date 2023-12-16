import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "@/state/auth";
import { selectIsAuth } from "@/selectors";
import { SignInData } from "@/typing/entities";
import SignIn from "./SignIn";

const SignInContainer: FC = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  return (
    <SignIn
      isAuth={isAuth}
      signIn={(payload: SignInData) => dispatch(signIn(payload))}
    />
  );
};

export default SignInContainer;
