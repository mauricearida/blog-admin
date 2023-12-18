import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import PostForm from "./PostForm";
import NotFound from "./NotFound";
import { getPost, updatePost } from "../api/post";
import { useNotification } from "../context/NotificationProvider";

export default function UpdatePost() {
  const { slug } = useParams();
  const [busy, setBusy] = useState(false);
  const [postInfo, setPostInfo] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { updateNotification } = useNotification();

  const fetchPost = async () => {
    const { error, post } = await getPost(slug);
    if (error) {
      setNotFound(true);
      return updateNotification("error", error);
    }
    setPostInfo({ ...post, tags: post.tags?.join(", ") });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleSubmit = async (data) => {
    setBusy(true);

    const { error, post } = await updatePost(postInfo.id, data);
    setBusy(false);

    if (error) return updateNotification("error", error);
    setPostInfo({ ...post, tags: post.tags?.join(", ") });
  };

  if (notFound) return <NotFound />;

  return (
    <PostForm
      onSubmit={handleSubmit}
      initialPost={postInfo}
      postBtnTitle="Update"
      busy={busy}
      resetAfterSubmit
    />
  );
}
