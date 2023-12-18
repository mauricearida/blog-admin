import { useEffect, useState } from "react";
import { ImSpinner11, ImEye, ImFilePicture, ImFilesEmpty, ImSpinner3 } from "react-icons/im";

import MarkdownHint from "./MarkdwnHint";
import { uploadImage } from "../api/post";
import { useNotification } from "../context/NotificationProvider";
import DeviceView from "./DeviceView";

export const defaultPost = {
  title: "",
  thumbnail: "",
  featured: false,
  content: "",
  tags: "",
  meta: "",
};

export default function PostForm({ initialPost, postBtnTitle, resetAfterSubmit, busy, onSubmit }) {
  // useState
  const [imageUrlToCopy, setImageUrlToCopy] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [showDeviceView, setShowDeviceView] = useState(false);
  const [postInfo, setPostInfo] = useState({ ...defaultPost });
  const [selectedThumbnailURL, setSelectedThumbnailURL] = useState("");
  const [displayMarkdownHint, setDisplayMarkdownHint] = useState(false);

  // HOOKS
  const { updateNotification } = useNotification();

  useEffect(() => {
    if (initialPost) {
      setPostInfo({ ...initialPost });
      setSelectedThumbnailURL(initialPost?.thumbnail);
    }

    return () => {
      if (resetAfterSubmit) resetForm();
    };
  }, [initialPost, resetAfterSubmit]);

  const { title, content, featured, tags, meta } = postInfo;

  // METHODS
  const handleChange = ({ target }) => {
    const { value, name, checked } = target;

    if (name === "thumbnail") {
      const file = target.files[0];
      if (!file.type?.includes("image")) {
        return alert("this is not an image!");
      }
      setPostInfo({ ...postInfo, thumbnail: file });
      return setSelectedThumbnailURL(URL.createObjectURL(file));
    }

    if (name === "featured") {
      localStorage.setItem("blogPost", JSON.stringify({ ...postInfo, featured: checked }));
      return setPostInfo({ ...postInfo, [name]: checked });
    }

    if (name === "tags") {
      const newtags = value.includes(",") ? value.split(",") : [value];

      if (newtags.length > 4)
        return updateNotification("warning", "Only the first 4 tags will be selected!");

      return setPostInfo({ ...postInfo, [name]: newtags });
    }

    if (name === "meta" && value.length >= 150) {
      return setPostInfo({ ...postInfo, meta: value.substring(0, 149) });
    }

    const newPost = { ...postInfo, [name]: value };

    setPostInfo({ ...newPost });

    localStorage.setItem("blogPost", JSON.stringify(newPost));
  };

  const handleImageUpload = async ({ target }) => {
    if (imageUploading) return;

    const file = target.files[0];
    if (!file.type?.includes("image")) {
      return updateNotification("error", "this is not an image!");
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const { error, image } = await uploadImage(formData);
    setImageUploading(false);
    if (error) return updateNotification("error", error);

    setImageUrlToCopy(image);
  };

  const handleOnCopy = () => {
    const textToCopy = `![Add image description here](${imageUrlToCopy})`;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, content, tags, meta } = postInfo;
    if (!title.trim()) return updateNotification("error", "Title is missing!");
    if (!content.trim()) return updateNotification("error", "Content is missing!");
    if (!tags) return updateNotification("error", "Tags are missing!");
    if (!meta.trim()) return updateNotification("error", "Meta description is missing!");

    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, " ")
      .split(" ")
      .filter((item) => item.trim())
      .join("-");

    const newTags = tags
      .split(",")
      .map((item) => item.trim())
      .splice(0, 4);

    const formData = new FormData();
    const finalPost = { ...postInfo, tags: JSON.stringify(newTags), slug };

    for (let key in finalPost) {
      formData.append(key, finalPost[key]);
    }
    onSubmit(formData);
  };

  const resetForm = () => {
    setPostInfo({ ...defaultPost });
    localStorage.removeItem("blogPost");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-2 flex">
        <div className="w-9/12 h-screen space-y-3 flex flex-col">
          {/* title and submit */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-700">Create New Post</h1>
            <div className="flex items-center space-x-5">
              <button
                onClick={resetForm}
                type="button"
                className="flex items-center space-x-2 px-3 ring-1 ring-blue-500 rounded h-10 text-blue-500 hover:text-white hover:bg-blue-500 transition"
              >
                <ImSpinner11 />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setShowDeviceView(true)}
                type="button"
                className="flex items-center space-x-2 px-3 ring-1 ring-blue-500 rounded h-10 text-blue-500 hover:text-white hover:bg-blue-500 transition"
              >
                <ImEye />
                <span>View</span>
              </button>
              <button className="h-10 w-36 hover:ring-1 bg-blue-500 rounded text-white hover:text-blue-500 hover:bg-transparent ring-blue-500 transition">
                <span>
                  {busy ? <ImSpinner3 className="animate-spin mx-auto text-xl" /> : postBtnTitle}
                </span>
              </button>
            </div>
          </div>

          {/* featured check box */}
          <div className="flex">
            <input
              name="featured"
              value={featured}
              onChange={handleChange}
              id="featured"
              type="checkbox"
              hidden
            />
            <label
              className="select-none flex items-center space-x-2 text-gray-700 cursor-pointer"
              htmlFor="featured"
            >
              <div className="w-4 h-4 rounded-full border-2 border-gray-700 flex items-center justify-center group-hover:border-blue-500">
                {featured && (
                  <div className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-blue-500" />
                )}
              </div>
              <span className="group-hover:text-blue-500">Featured</span>
            </label>
          </div>

          {/* title input */}
          <input
            name="title"
            type="text"
            value={title}
            onFocus={() => setDisplayMarkdownHint(false)}
            onChange={handleChange}
            className="text-xl outline-none focus:ring-1 rounded p-2 w-full font-semibold"
            placeholder="Post title"
          />

          {/* image input */}
          <div className="flex space-x-2">
            <div>
              <input onChange={handleImageUpload} id="image-input" type="file" hidden />
              <label
                htmlFor="image-input"
                className="flex items-center space-x-2 px-3 ring-1 ring-gray-700 rounded h-10 text-gray-700 hover:text-white hover:bg-gray-700 transition cursor-pointer"
              >
                <span>Place image</span>
                {imageUploading ? <ImSpinner3 className="animate-spin" /> : <ImFilePicture />}
              </label>
            </div>

            {imageUrlToCopy && (
              <div className="flex-1 justify-between flex bg-gray-400 rounded overflow-hidden">
                <input
                  type="text"
                  value={imageUrlToCopy}
                  className="bg-transparent px-2 text-white w-full"
                  disabled
                />
                <button
                  onClick={handleOnCopy}
                  type="button"
                  className="text-xs flex flex-col items-center justify-center p-1 self-stretch bg-gray-700 text-white"
                >
                  <ImFilesEmpty /> <span>copy</span>
                </button>
              </div>
            )}
          </div>

          <textarea
            name="content"
            value={content}
            onChange={handleChange}
            onFocus={() => setDisplayMarkdownHint(true)}
            className="resize-none outline-none focus:ring-1 rounded p-2 w-full flex-1 font-mono tracking-wide text-lg"
            placeholder="## Markdown"
          ></textarea>

          {/* tags input */}
          <div>
            <label className="text-gray-500" htmlFor="tags">
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={tags}
              onChange={handleChange}
              placeholder="Tag one, Tag two"
              className="outline-none focus:ring-1 rounded p-2 w-full"
            />
          </div>

          {/* meta description input */}
          <div>
            <label className="text-gray-500" htmlFor="meta">
              Meta description {meta?.length} / 150
            </label>
            <textarea
              id="meta"
              name="meta"
              value={meta}
              onChange={handleChange}
              placeholder="Meta desription"
              className="resize-none outline-none focus:ring-1 rounded p-2 w-full h-28"
            ></textarea>
          </div>
        </div>

        <div className="w-1/4 px-2 relative">
          <h1 className="text-xl font-semibold text-gray-700 mb-2">Thumbnail</h1>
          <div>
            <input onChange={handleChange} name="thumbnail" id="thumbnail" type="file" hidden />
            <label className="cursor-pointer" htmlFor="thumbnail">
              {selectedThumbnailURL ? (
                <img src={selectedThumbnailURL} className="aspect-video shadow-sm rounded" alt="" />
              ) : (
                <div className="border border-dashed border-gray-500 aspect-video text-gray-500 flex flex-col justify-center items-center">
                  <span>Select thumbnail</span>
                  <span className="text-xs">Recommended size</span>
                  <span className="text-xs">1280 * 720</span>
                </div>
              )}
            </label>
          </div>

          {/* Markdown rules */}
          <div className="absolute top-1/2 -translate-y-1/2">
            {displayMarkdownHint && <MarkdownHint />}
          </div>
        </div>
      </form>
      <DeviceView
        title={title}
        content={content}
        thumbnail={selectedThumbnailURL}
        visible={showDeviceView}
        onClose={() => setShowDeviceView(false)}
      />
    </>
  );
}
