import { HashRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/navBar.jsx";
import Home from "./pages/home.jsx";
import Favorites from "./pages/favorites.jsx";
import SignIn from "./pages/signIn.jsx";
import Watchlist from "./pages/watchlist.jsx";
import Group from "./pages/group.jsx";
import GroupList from "./pages/groupList.jsx";
import Profile from "./pages/profile.jsx";
import CreateAccount from "./pages/createAccount.jsx";
import Login from "./pages/login.jsx";
import SearchResults from "./pages/searchResults.jsx";

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/groupList" element={<GroupList />} />
        <Route path="/group" element={<Group />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
