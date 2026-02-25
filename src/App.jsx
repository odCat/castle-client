import './App.css'
import ChessGame from "./components/ChessGame/ChessGame.jsx";
import Copyright from "./components/Copyright.jsx";
import LoginCard from "./components/LoginCard.jsx";
import OnlineCard from "./components/OnlineCard.jsx";
import Play from "./components/Play/Play.jsx";
import RegisterCard from "./components/RegisterCard.jsx";
import TopBar from "./components/TopBar.jsx";
import Watch from "./components/Watch.jsx";
import {Box, Container} from "@mui/material";
import {Route, Routes, useLocation} from "react-router";
import {styled} from "@mui/material/styles";


const MainBox = styled(Box)({
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
})

const MainContainer = styled(Container)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1
})

export default function App() {

    const location = useLocation();

    const hideOnPaths = ["/", "/login", "/register"];
    const showTopBar = !hideOnPaths.includes(location.pathname);

    return (
        <MainBox>
            {showTopBar && <TopBar />}

            <MainContainer disableGutters>
                <Routes>
                    <Route path="/" element={<OnlineCard />} />
                    <Route path="/register" element={<RegisterCard />} />
                    <Route path="/login" element={<LoginCard />} />
                    <Route path="/play" element={<Play />} />
                    <Route path="/watch" element={<Watch />} />
                    <Route path="/game/:gameId" element={<ChessGame />} />
                </Routes>
            </MainContainer>

            <Copyright />
        </MainBox>
  )
}
