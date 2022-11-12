import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

export const useQueryString = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const searchParam = new URLSearchParams(search);
  const searchObj = Object.fromEntries(searchParam.entries());
  const removeFromQueryString = (key) => {
    if (searchObj[key]) {
      delete searchObj[key];
      setQueryStringInUrl({
        ...searchObj,
      });
    }
  };
  const setQueryString = (query = {}) =>
    setQueryStringInUrl({
      ...searchObj,
      ...query,
    });
  const setQueryStringInUrl = (query = {}) => {
    navigate(
      {
        pathname: "/",
        search: `?${createSearchParams(query)}`,
      },
      {
        replace: true,
      }
    );
  };
  return { queryString: searchObj, setQueryString, removeFromQueryString };
};
