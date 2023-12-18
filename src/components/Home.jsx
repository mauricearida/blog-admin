import { useEffect, useState } from "react";

import PostCard from "./PostCard";
import { getPosts } from "../api/post";
import { deletePost } from "../api/post";
import { useSearch } from "../context/SearchProvider";
import { useNotification } from "../context/NotificationProvider";

let pageNo = 0;
const POST_LIMIT = 9;

export default function Home() {
  const { searchResult } = useSearch();

  // STATES
  const [posts, setPosts] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState(0);

  // FOR THE PAGES COUNT
  const getPagesCount = (length) => Math.ceil(length / POST_LIMIT);
  const pagesCount = getPagesCount(totalPostCount);
  const paginationArray = new Array(pagesCount).fill(" ");
  const { updateNotification } = useNotification();

  const fetchPosts = async () => {
    const { error, posts, postCount } = await getPosts(pageNo, POST_LIMIT);

    if (error) return updateNotification("error", error);
    setPosts(posts);
    setTotalPostCount(postCount);
  };

  useEffect(() => {
    fetchPosts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMorePosts = (index) => {
    pageNo = index;
    fetchPosts();
  };

  const handleDelete = async ({ id }) => {
    const confirmed = window.confirm("Are you sure!");
    if (!confirmed) return;

    const { error, message } = await deletePost(id);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);

    const newPosts = posts.filter((p) => p.id !== id);
    setPosts(newPosts);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 pb-5">
        {(searchResult.length ? searchResult : posts).map((post) => (
          <PostCard key={post.id} post={post} onDeleteClick={() => handleDelete(post)} />
        ))}
      </div>
      {
        <div className="py-5 flex justify-center items-center space-x-3">
          {paginationArray.length > 1 && !searchResult.length
            ? paginationArray.map((_, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => fetchMorePosts(index)}
                    className={
                      index === pageNo
                        ? "text-blue-500 border-b-2 border-b-blue-500"
                        : "text-gray-500"
                    }
                  >
                    {index + 1}
                  </button>
                );
              })
            : null}
        </div>
      }
    </div>
  );
}
