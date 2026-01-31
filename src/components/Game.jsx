import {Chessboard} from "react-chessboard";
import {Chess} from 'chess.js'
import {useParams} from "react-router";
import {useRef, useState} from "react";


export default function Game() {

    const { gameId } = useParams();
    const chessRef = useRef(new Chess());
    const game = chessRef.current;

    const [chessPosition, setChessPosition] = useState(game.fen());
    const [squareOptions, setSquareOptions] = useState({});
    const [possibleMoves, setPossibleMoves] = useState([]);

    function onPieceDrop({ sourceSquare, targetSquare }) {
        if (!targetSquare)
            return false;
        try {
            game.move({ from: sourceSquare, to: targetSquare  });
            setChessPosition(game.fen());
            setSquareOptions({});
            setPossibleMoves([]);
            return true;
        } catch {
            return false;
        }
    }

    function onSquareClick({ square, piece }) {

        if (possibleMoves.length !== 0) {
            for (const move of possibleMoves) {
                if (square === move.to) {
                    game.move({from: move.from, to: move.to})
                    setChessPosition(game.fen());
                }
            }
            setSquareOptions({});
            setPossibleMoves([]);
            return;
        }

        const moves = game.moves({ square: square, verbose: true });

        if (piece === null || moves.length === 0) {
            setSquareOptions({});
            return;
        }

        setPossibleMoves(moves);
        const updatedSquares = {};
        for (const move of moves) {
            const color = getSquareColor(move.to) === "dark" ? "rgb(60,97,134)" : "rgb(168,170,178)";

            updatedSquares[move.to] = {
                background:
                    game.get(move.to) &&
                    game.get(move.to)?.color !== game.get(square)?.color
                        ? "radial-gradient(circle, " + color + " 85%, transparent 85%)" // larger circle for capturing
                        : "radial-gradient(circle, " + color + " 20%, transparent 20%)", // smaller circle for moving
                borderRadius: '50%',
            };
        }
        updatedSquares[square] = { boxShadow: 'inset 0px 0px 0px 1px black' };
        setSquareOptions(updatedSquares);
    }

    function getSquareColor(square) {
        const rank = parseInt(square[1]) - 1;
        const file = square[0].charCodeAt(0) - "a".charCodeAt(0);

        return (rank + file) % 2 === 0 ? "dark" : "light";
    }

    const chessboardOptions = {
        boardStyle: { width: "648px" },
        alphaNotationStyle: { fontWeight: 500 },
        numericNotationStyle: { fontWeight: 500 },
        lightSquareNotationStyle: { color: "#578cc1" },
        lightSquareStyle: { backgroundColor: "#ffffff" },
        darkSquareStyle: { backgroundColor: "#578cc1" },

        draggingPieceGhostStyle: { opacity: 0 },
        dropSquareStyle: { boxShadow: 'inset 0px 0px 0px 0px black', },
        draggingPieceStyle: { transform: "scale(1)" },
        dragActivationDistance: 1,
        showAnimations: false,

        onPieceDrop,
        onSquareClick,

        position: chessPosition,
        squareStyles: squareOptions,
    };

    return (
        <>
            <Chessboard options={chessboardOptions} />
        </>
    )
}