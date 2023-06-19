import React from "react";
import { Route, Routes } from "react-router-dom";
import { getUserIDFromJWT } from "./backend/boardapi";
import PageAdmin from "./components/PageAdmin";
import PageBoard from "./components/PageBoard";
import PageChannel from "./components/PageChannel";
import PageMessage from "./components/PageMessage";
import PagePrefs from "./components/PagePrefs";
import { UserIDContext } from "./components/UserIDContext";
import PageMessageCreate from "./components/PageMessageCreate";
import PageChannelCreate from "./components/PageChannelCreate";
import PageChannelEdit from "./components/PageChannelEdit";
import PageMessageEdit from "./components/PageMessageEdit";

function App() {
  const [userID, setUserID] = React.useState(getUserIDFromJWT());
  return (
    < div >
      <UserIDContext.Provider value={{ userID, setUserID }} >
        <Routes>
          <Route path='/' element={<PageBoard />} />
          {/* <Route path='/board' element={<PageBoard />} /> */}

          <Route path='/channel/create' element={<PageChannelCreate />} />
          <Route path='/channel/:channelID/edit' element={<PageChannelEdit />} />

          <Route path="/channel/:channelID/newMessage" element={<PageMessageCreate />} />
          <Route path='/message/:messageID/edit' element={<PageMessageEdit />} />



          <Route path='/channel/:channelID' element={<PageChannel />} />
          <Route path='/message/:messageID' element={<PageMessage />} />

          <Route path='/admin' element={<PageAdmin />} />
          <Route path='/prefs' element={<PagePrefs />} />
        </Routes>
      </UserIDContext.Provider>
    </div >
  );
}


export default App;
