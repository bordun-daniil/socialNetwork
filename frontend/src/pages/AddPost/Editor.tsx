import { FC, useState, ChangeEvent, useRef } from "react";
import { useInput } from "@/hooks";

interface EditorProps {
  createPost: (post: FormData) => void;
}

interface LoadedImage {
  index: number;
  image: any;
  url: any;
}

const Editor: FC<EditorProps> = ({ createPost }) => {
  const [loadedImages, setLoadedImages] = useState<LoadedImage[]>([]);
  const [loadedImagesIndex, setLoadedImagesIndex] = useState(0);
  const {
    value: contentValue,
    bind: contentBind,
    reset: contentReset,
  } = useInput();

  const formRef = useRef<HTMLFormElement>(null);

  const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      const render = new FileReader();

      render.onload = (e) => {
        setLoadedImages((prevValue) => [
          ...prevValue,
          { index: loadedImagesIndex, image, url: e.target?.result },
        ]);
      };

      render.readAsDataURL(image);
      setLoadedImagesIndex((prevIndex) => prevIndex + 1);
    }
  };

  const removeLoadedImage = (imageIndex: number) => {
    setLoadedImages(loadedImages.filter((image) => image.index !== imageIndex));
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const formNode = formRef.current;

    for (let idx = 0; idx < loadedImages.length; idx++) {
      formData.append("post_images", loadedImages[idx].image);
    }
    formData.append("content", contentValue);

    createPost(formData);

    formNode?.reset();
    contentReset();
    setLoadedImages([]);
  };

  return (
    <form className="post-editor" onSubmit={handleSubmit} ref={formRef}>
      <div className="add-text">
        <h3>Content:</h3>
        <textarea
          {...contentBind}
          placeholder="Write an something..."
        ></textarea>
      </div>
      <div className="add-image">
        <h3>Add Images</h3>
        <div className="user-images">
          <label htmlFor="file-upload" className="custom-file-upload">
            Select file
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={loadImage}
            placeholder="Select images"
            accept="image/png, image/jpeg"
            disabled={loadedImages.length >= 10}
          />
        </div>
        <div className="uploaded-files">
          {loadedImages.map((image) => (
            <div className="image-container" key={image.index}>
              <button onClick={() => removeLoadedImage(image.index)}>+</button>
              <div
                className="image"
                style={{ backgroundImage: `url(${image.url})` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="add-button">
        Add Post
      </button>
    </form>
  );
};

export default Editor;
