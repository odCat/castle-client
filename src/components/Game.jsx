import {Chessboard} from "react-chessboard";
import {Chess} from 'chess.js'
import {useParams} from "react-router";
import {useRef, useState} from "react";


export default function Game() {

    const { gameId } = useParams();
    const chessRef = useRef(new Chess());
    const chess = chessRef.current;

    const [chessPosition, setChessPosition] = useState(chess.fen());

    function onPieceDrop({ sourceSquare, targetSquare }) {
        if (!targetSquare)
            return false;

        try {
            console.log("Log: " + sourceSquare + " " + targetSquare);
            chess.move({ from: sourceSquare, to: targetSquare  });
            setChessPosition(chess.fen());
            return true;
        } catch {
            console.log("Illegal move!")
            return false;
        }
    }

    function onSquareClick({ square, piece }) {
        if (piece !== null) {
            console.log("Piece on " + square + ": " + piece.pieceType);
        } else
            console.log("Empty square");
    }

    const chessboardOptions = {
        boardStyle: { width: "648px" },
        alphaNotationStyle: { fontWeight: 500 },
        numericNotationStyle: { fontWeight: 500 },
        lightSquareNotationStyle: { color: "#578cc1" },
        lightSquareStyle: { backgroundColor: "#ffffff" },
        darkSquareStyle: { backgroundColor: "#578cc1" },

        draggingPieceGhostStyle: { opacity: 0 },
        dropSquareStyle: {
            boxShadow: 'inset 0px 0px 0px 0px black',
        },
        showAnimations: false,

        onPieceDrop,
        onSquareClick,

        position: chessPosition,
    };

    return (
        <>
            <Chessboard options={chessboardOptions} />
        </>
    )
}