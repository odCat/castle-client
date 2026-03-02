import {Box, Button, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";
import Diagram from "./Diagram.jsx";
import Divider from "@mui/material/Divider";


const LoadingText = styled(Typography) ({
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
})

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

export default function Watch() {

    const [inProgressGameList, setInProgressGameList] = useState([]);

    async function fetchInProgress() {
        try {
            const response = await fetch("http://localhost:8080/games/inprogress");
            const json = await response.json();
            console.log("Refreshing games");
            console.log(json);
            setInProgressGameList(json);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchInProgress();
    }, []);


    const diagrams = inProgressGameList.map(game =>
        <a href={"/games/id/" + game.id} key={game.id}>
            <Diagram game={game} />
        </a>
    );

    return (
        inProgressGameList.length !== 0 ? (
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >

                <RefreshButton variant="outlined" onClick={fetchInProgress}>Refresh</RefreshButton>

                <Divider sx={{width: "100%", my: 2, borderColor: "#424548"}}/>

                <GameList>

                    {diagrams}

                </GameList>
            </Box>
        ) : (
            <LoadingText>Loading games...</LoadingText>
        )
    )
}