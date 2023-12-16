import { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Post } from "@/typing/entities";

import "swiper/swiper.scss";

interface PostImagesProps {
  post: Post;
}

const PostImages: FC<PostImagesProps> = ({ post }) => {
  const [slideIndex, setSlideIndex] = useState(1);

  if (post.post_images?.length === 0) {
    return null;
  }

  return (
    <div className="post-images">
      <Swiper
        slidesPerView={1}
        onRealIndexChange={(slide) => setSlideIndex(slide.realIndex + 1)}
      >
        {post.post_images?.map((image, index) => (
          <SwiperSlide key={index}>
            <img alt={String(image.id)} src={image.image}></img>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="indexs">
        {slideIndex} / {post.post_images?.length}
      </div>
    </div>
  );
};

export default PostImages;
