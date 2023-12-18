import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PostForm from "./PostForm";
import { createPost } from "../api/post";
import { useNotification } from "../context/NotificationProvider";

export default function CreatePost() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [postInfo, setPostInfo] = useState(null);
  const [resetAfterSubmit, setResetAfterSubmit] = useState(false);

  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, post } = await createPost(data);

    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", "Post has been successfully created");
    setResetAfterSubmit(true);
    navigate(`/update-post/${post.slug}`);
  };

  useEffect(() => {
    const result = localStorage.getItem("blogPost");
    if (!result) return;

    const oldPost = JSON.parse(result);
    setPostInfo({ ...oldPost });
  }, []);

  return (
    <PostForm
      onSubmit={handleSubmit}
      initialPost={postInfo}
      busy={busy}
      postBtnTitle="Post"
      resetAfterSubmit={resetAfterSubmit}
    />
  );
}
