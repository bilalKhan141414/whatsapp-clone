
export default function useLocalStorage() {
    
    const getUser = () => {
       let userInfo = localStorage.getItem('userChatApp');
       if(userInfo) {
        userInfo = JSON.parse(userInfo)
        if(!userInfo.user) {
          clearLocalStorage();
          userInfo=null;
        }
       };
       return userInfo;
       
    }
    const clearLocalStorage = () => {
      localStorage.removeItem('userChatApp');
    }
    return (
      {
        getUser,
        clearLocalStorage
      }
    )
}
