import {Card, Button, Typography} from "@mui/material";


export default function WaitForPlayer({ game, setMyGame }) {

    async function closeGame() {
        try {
            await fetch("http://localhost:8080/games/id/" + game.id, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            setMyGame(null);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Card variant="outlined"
            sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 2,
            }}
        >
            <Typography>Waiting for a player to join...</Typography>
            <Button variant="outlined" onClick={closeGame}>Close</Button>
        </Card>
    )
}
