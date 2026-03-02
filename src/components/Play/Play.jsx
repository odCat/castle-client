import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import {Box, Button, Card, InputLabel, MenuItem, Paper, Select, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";


const GameList = styled(Box)({
    display: 'flex',
    flexDirection: "column",
    gap: 10,
    justifyContent: 'center',
})

const GameContainer = styled(Paper)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 16,
})

export default function Play() {

    const navigate = useNavigate();
    const [color, setColor] = useState("white");
    const [myGame, setMyGame] = useState(null);
    const [openGameList, setOpenGameList] = useState([]);

    function changeColor(event) {
        setColor(event.target.value);
    }

    async function createGame() {
        try {
            const response = await fetch("http://localhost:8080/games/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ color: "white", name: "Dorin" })
            });

            const json = await response.json();
            console.log("Refreshing games");
            console.log(json);
            setMyGame(json);
        } catch (error) {
            console.log(error.message);
        }
    }

    async function joinGame(id) {
        const gameToJoin = openGameList.find(game => game.id === id);
        console.log(gameToJoin);
        const color = gameToJoin.white === "" ? "white" : "black";

        try {
            const response = await fetch("http://localhost:8080/games/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id, color: color, name: "Marin" })
            });

            const json = await response.json();
            console.log("Joining a game...");
            console.log(json);
            console.log("http://localhost:5173/games/id/" + json.id);
            setMyGame(json);
            navigate("http://localhost:5173/games/id/" + json.id);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchOpenGames();
    }, []);

    async function fetchOpenGames() {
        try {
            const response = await fetch("http://localhost:8080/games/open");
            const json = await response.json();
            console.log("Refreshing games");
            console.log(json);
            setOpenGameList(json);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <Card sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "400px",
            }}>
                <Typography variant="h6" sx={{ ml: 1 }}>Create Game</Typography>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="color-label">Color</InputLabel>
                    <Select
                        labelId="color-label"
                        variant={"filled"}
                        value={color}
                        label="Color"
                        onChange={ changeColor }
                    >
                        <MenuItem value={"white"}>White</MenuItem>
                        <MenuItem value={"black"}>Black</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="outlined" onClick={createGame}>Create</Button>
            </Card>

            <Divider sx={{ my: 5.5 }} />

            <GameList sx={{ maxWidth: "700px" }}>
                {openGameList.map((game) => (
                    <GameContainer>
                        <Typography>{"#" + game.id}</Typography>
                        <Typography>{game.white ? "White: " + game.white : "Black: " + game.black}</Typography>
                        <Button variant="outlined" onClick={() => joinGame(game.id)}>Join</Button>
                    </GameContainer>
                 ))}
            </GameList>
        </div>
    )
}