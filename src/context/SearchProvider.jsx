import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";

import { searchPost } from "../api/post";
import { useNotification } from "./NotificationProvider";

const SearchContext = createContext();

export default function SearchProvider({ children }) {
  const [searchResult, setSearchResult] = useState([]);

  const navigate = useNavigate();

  const { updateNotification } = useNotification();

  const handleSearch = async (query) => {
    const { posts, error } = await searchPost(query);

    if (error) return updateNotification("error", error);
    setSearchResult(posts);
    navigate("/");
  };

  const resetSearch = () => {
    setSearchResult([]);
  };

  return (
    <SearchContext.Provider value={{ searchResult, handleSearch, resetSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
