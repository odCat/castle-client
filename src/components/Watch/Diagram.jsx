import {Chessboard} from "react-chessboard";
import {Typography} from "@mui/material";

export default function Diagram({ game }) {
    const diagramOptions = {
        boardStyle: { width: "300px" },
        lightSquareNotationStyle: { color: "#578cc1" },
        lightSquareStyle: { backgroundColor: "#ffffff" },
        darkSquareStyle: { backgroundColor: "#578cc1" },
        allowDragging: false,
        allowDrawingArrows: false,
        position: game.fen,
    }

    return (
        <div>
            <Typography>{game.black}</Typography>
            <Chessboard options={diagramOptions} />
            <Typography>{game.white}</Typography>
        </div>
    );
}