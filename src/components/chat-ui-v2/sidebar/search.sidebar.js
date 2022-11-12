import { useQueryString } from "../../../shared/custom-hooks/useQueryString";

let searchInterval = null;
const Search = () => {
  const { queryString, setQueryString, removeFromQueryString } =
    useQueryString();

  const clearSearchInterval = () =>
    searchInterval && clearTimeout(searchInterval);

  const handleOnSearchInputChange = (e) => {
    clearSearchInterval();

    const { value } = e.target;

    if (value.length <= 0) return removeFromQueryString("search");
    searchInterval = setTimeout(() => setQueryString({ search: value }), 1000);
  };
  return (
    <div className='py-2 px-2 bg-grey-lightest'>
      <input
        type='text'
        defaultValue={queryString.search}
        className='w-full px-2 py-2 text-sm'
        placeholder='Search or start new chat'
        onChange={handleOnSearchInputChange}
      />
    </div>
  );
};

export default Search;
