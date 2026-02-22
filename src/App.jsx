import './App.css'
import LoginCard from "./components/LoginCard.jsx";
import OnlineCard from "./components/OnlineCard.jsx";
import Copyright from "./components/Copyright.jsx";
import {Box, Container} from "@mui/material";
import {Route, Routes} from "react-router";
import RegisterCard from "./components/RegisterCard.jsx";
import ChessGame from "./components/ChessGame/ChessGame.jsx";


export default function App() {

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                <Routes>
                    <Route path="/" element={<OnlineCard />} />
                    <Route path="/register" element={<RegisterCard />} />
                    <Route path="/login" element={<LoginCard />} />
                    <Route path="/game/:gameId" element={<ChessGame />} />
                </Routes>
            </Container>

            <Copyright />
        </Box>
  )
}
