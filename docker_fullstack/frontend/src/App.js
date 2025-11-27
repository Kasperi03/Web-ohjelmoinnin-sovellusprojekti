import { HashRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/navBar.jsx";
import Home from "./pages/home.jsx";
import Favorites from "./pages/favorites.jsx";
import SignIn from "./pages/signIn.jsx";
import Watchlist from "./pages/watchlist.jsx";
import GroupPage from "./pages/group.jsx";
import GroupList from "./pages/groupList.jsx";
import Profile from "./pages/profile.jsx";
import CreateAccount from "./pages/createAccount.jsx";
import Login from "./pages/login.jsx";
import SearchResults from "./pages/searchResults.jsx";
import { GenreProvider } from "./context/genreContext.jsx";
import "./pages/styles/darkTheme.css";
import MovieDetails from "./pages/movieDetails.jsx";
import MyGroups from "./pages/myGroups.jsx";

function App() {
  return (
    <GenreProvider>
      <HashRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/groupList" element={<GroupList />} />
          <Route path="/groups/:groupId" element={<GroupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/my-groups" element={<MyGroups />} />

        </Routes>
      </HashRouter>
    </GenreProvider>
  );
}

export default App;
