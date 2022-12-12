import { RouterProvider } from "react-router-dom";
import "./App.scss";
import { router } from "./router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

export const queryClient = new QueryClient({});

const onError = (response) => {
  if (!response.status) {
    return response.showErrorAlerts?.();
  }
};
// queryClient.setQueryDefaults(["api"], {
//   onError,
// });
queryClient.setMutationDefaults(["api"], {
  onError,
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router(queryClient)} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
