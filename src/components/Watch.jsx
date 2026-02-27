import {Box, Button, Container} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";
import Diagram from "./Diagram.jsx";
import Divider from "@mui/material/Divider";


const RefreshButton = styled(Button) ({
    width:"100px",
    margin: "16px"
})

const GameList = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: "40px",
    justifyContent: 'center',
    width: ""
})

const GameContainer = styled(Container)({
    width: "350px",
    height: "350px",
    zIndex: 1,
    flex: "0 0 auto"
})

export default function Watch() {

    const [gameList, setGameList] = useState([]);

    async function fetchGames() {
        try {
            const response = await fetch("http://localhost:8080/games");
            const json = await response.json();
            console.log("Refreshing games");
            console.log(json);
            setGameList(json);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchGames();
    }, []);


    const diagrams = gameList.map(game =>
        <a href={"/game/" + game.id} key={game.id}>
            <Diagram game={game} />
        </a>
    );

    return (
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <RefreshButton variant="outlined" onClick={fetchGames}>Refresh</RefreshButton>

            <Divider sx={{ width: "100%", my: 2, borderColor: "#424548" }} />

            <GameList>

                {diagrams}

            </GameList>
        </Box>
    )
}