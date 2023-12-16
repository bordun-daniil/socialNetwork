import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "@/state/auth";
import { selectIsAuth } from "@/selectors";
import { SignUpData } from "@/typing/entities";
import SignUp from "./SignUp";
import { sendWarningMessageToAlert } from "@/state/components";

const SignUpContainer: FC = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  return (
    <SignUp
      isAuth={isAuth}
      signUp={(payload: SignUpData) => dispatch(signUp(payload))}
      sendWarningMessageToAlert={(message: string) =>
        dispatch(sendWarningMessageToAlert(message))
      }
    />
  );
};

export default SignUpContainer;
