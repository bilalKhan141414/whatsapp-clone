import Sidebar from "../components/chat-ui-v2/sidebar/sidebar";
import ChatDataProvider from "../context/providers/ChatDataProvider";
import { getUserDetails } from "../queries/UserQueries";
import {
  ChatContainer,
  ChatManager,
  NoChatSelectedContainer,
} from "../components/chat-ui-v2/chat";
import { useQueryString } from "../shared/custom-hooks/useQueryString";

export const contactDetailQuery = () => ({
  queryKey: ["detail"],
  queryFn: async () => getUserDetails(),
});

export function ChatPage() {
  const { queryString } = useQueryString();

  const isChatSelected = !!queryString?.friend && !queryString?.search;
  return (
    <ChatDataProvider>
      <ChatContainer>
        <Sidebar />
        {isChatSelected ? <ChatManager /> : <NoChatSelectedContainer />}
      </ChatContainer>
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
