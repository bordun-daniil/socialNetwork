import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { activateNavbarLink } from "@/state/components";
import { NavbarLinks } from "@/typing/entities";
import AddPost from "./AddPost";
import Editor from "./Editor";
import { createPost } from "@/state/posts";

const AddPostContainer: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(activateNavbarLink(NavbarLinks.ADD_POST));
  }, [dispatch]);

  return (
    <AddPost>
      <Editor createPost={(post: FormData) => dispatch(createPost(post))} />
    </AddPost>
  );
};

export default AddPostContainer;
