import {Box, Container} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";
import Diagram from "./Diagram.jsx";


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

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:8080/games");
                const json = await response.json();
                console.log(json);
                setGameList(json);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchGames();
    }, []);

    const diagrams = gameList.map(game =>
        <a href={"/game/" + game.id} key={game.id}>
            <Diagram game={game} />
        </a>
    );

    return (
        <GameList>

            {diagrams}

        </GameList>
    )
}