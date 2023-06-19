import React from "react";

interface UserIDContextType {
    userID: string | undefined;
    setUserID: (userID: string | undefined) => void
}

export const UserIDContext = React.createContext<UserIDContextType>({} as UserIDContextType);
export const useUserIDContext = () => React.useContext(UserIDContext);