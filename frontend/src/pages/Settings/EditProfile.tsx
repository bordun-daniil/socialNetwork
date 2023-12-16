import { ChangeEvent, FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "@/selectors";
import { editUser, getUserData } from "@/state/user";
import Head from "../Profile/components/Head";
import { useHistory } from "react-router-dom";

const EditProfile: FC = () => {
  const user = useSelector(selectUserData);

  const [userPreview, setUserPreview] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  const [avatarImage, setAvatarImage] = useState<any>(null);
  const [avatarImageUrlResult, setAvatarImageUrlResult] = useState<any>(null);
  const [headerImage, setHeaderImage] = useState<any>(null);
  const [headerImageUrlResult, setHeaderImageUrlResult] = useState<any>(null);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();

    form.append("first_name", firstName);
    form.append("last_name", lastName);
    form.append("bio", bio);
    form.append("avatar_image", avatarImage);
    form.append("header_image", headerImage);

    dispatch(editUser(form));
    dispatch(getUserData());
    history.push("/profile/");
  };

  const loadAvatarImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      const render = new FileReader();

      render.onload = (e) => {
        setAvatarImageUrlResult(e.target?.result);
      };

      render.readAsDataURL(image);
      setAvatarImage(image);
    }
  };

  const loadHeadingImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      const render = new FileReader();

      render.onload = (e) => {
        setHeaderImageUrlResult(e.target?.result);
      };

      render.readAsDataURL(image);
      setHeaderImage(image);
    }
  };

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setBio(user.bio);
    setAvatarImageUrlResult(user.avatar_image);
    setHeaderImageUrlResult(user.header_image);
  }, [user]);

  useEffect(() => {
    setUserPreview({
      first_name: firstName,
      last_name: lastName,
      bio,
      avatar_image: avatarImageUrlResult,
      header_image: headerImageUrlResult,
    });
  }, [firstName, lastName, bio, avatarImageUrlResult, headerImageUrlResult]);

  return (
    <section className="edit-profile__page">
      <h2 className="heading">Edit profile</h2>
      <div className="preview">
        <Head user={userPreview} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="base-input"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />
        <input
          className="base-input"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />
        <textarea
          className="base-input"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />
        <div className="avatar-image">
          <label htmlFor="avatar-image">Load avatar image</label>
          <div
            className="loaded-image"
            style={{ backgroundImage: `url(${avatarImageUrlResult})` }}
          ></div>
          <input
            type="file"
            onChange={loadAvatarImage}
            id="avatar-image"
            accept="image/png, image/jpeg"
          />
        </div>
        <div className="heading-image">
          <label htmlFor="heading-image">Load heading image</label>
          <div
            className="loaded-image"
            style={{ backgroundImage: `url(${headerImageUrlResult})` }}
          ></div>
          <input
            type="file"
            onChange={loadHeadingImage}
            id="heading-image"
            accept="image/png, image/jpeg"
          />
        </div>
        <button type="submit" className="base-button">
          Submit
        </button>
      </form>
    </section>
  );
};

export default EditProfile;
