import Sidebar from "../components/chat-ui-v2/sidebar/sidebar";
import ChatDataProvider from "../context/providers/ChatDataProvider";
import { getUserDetails } from "../queries/UserQueries";
import {
  ChatContainer,
  NoChatSelectedContainer,
} from "../components/chat-ui-v2/chat";
import { useQueryString } from "../shared/custom-hooks/useQueryString";

export const contactDetailQuery = () => ({
  queryKey: ["detail"],
  queryFn: async () => getUserDetails(),
});

export default function Chat({ location }) {
  const { queryString } = useQueryString();

  const isChatSelected = !!queryString?.friend && !queryString?.search;
  return (
    <ChatDataProvider>
      <div
        className='h-screen overflow-hidden '
        style={{ backgroundColor: "#edf2f7" }}>
        <div>
          <div
            className='w-full h-32'
            style={{ backgroundColor: "#449388" }}></div>

          <div className='container mx-auto' style={{ marginTop: " -128px" }}>
            <div className='py-6 h-screen'>
              <div className='flex border border-grey rounded shadow-lg h-full'>
                <Sidebar />
                {isChatSelected ? (
                  <ChatContainer />
                ) : (
                  <NoChatSelectedContainer />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatDataProvider>
  );
}
export const loader = (queryClient) => async () => {
  const query = contactDetailQuery();
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
