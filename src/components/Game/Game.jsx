import "./Game.css"
import GameDebug from "./GameDebug.jsx";
import {Card, Typography} from "@mui/material";
import {Chessboard, defaultPieces} from "react-chessboard";
import {Chess} from "chess.js";
import { Client } from '@stomp/stompjs';
import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {styled} from "@mui/material/styles";
import {useSelector} from "react-redux";
import Divider from "@mui/material/Divider";


const LoadingText = styled(Typography) ({
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
})

export default function Game() {

    const params = useParams();
    const player = useSelector(store => store.player);
    const chessGameRef = useRef(new Chess("8/8/8/8/8/8/8/8 w - - 0 1", { skipValidation: true }));
    const [white, setWhite] = useState("");
    const [black, setBlack] = useState("");
    const { color } = useLocation().state || { color: "white" };
    const navigate = useNavigate();

    const [pgn, setPgn] = useState("")
    const [position, setPosition] = useState("");
    const [squareOptions, setSquareOptions] = useState({});
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [promotionMove, setPromotionMove] = useState(null);

    function checkGameOver() {

        const game = chessGameRef.current;

        let result = "*";
        if (game.isGameOver() === true)
            if (game.isDraw() === true) {
                result = "1/2-1/2";
            }
            else
                result = game.turn() === "w" ? "0-1" : "1-0";

        game.setHeader("Result", result);
    }

    useEffect(() => {

        const game = chessGameRef.current;

        const client = new Client({
            brokerURL: "ws://localhost:8080/websocket",
            onConnect: () => {
                client.subscribe(`/topic/game/${params.gameId}`, (message) => {
                    const moveData = JSON.parse(message.body);

                    try {
                        game.move({ from: moveData.from, to: moveData.to });
                        checkGameOver();
                        setPgn(game.pgn());
                        setPosition(game.fen());
                        setSquareOptions({});
                        setPossibleMoves([]);
                    } catch {
                        // do nothing
                    }
                })
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        const fetchGame = async function() {
            try {
                const response = await fetch("http://localhost:8080/games/id/" + params.gameId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + player.password
                    }
                })
                const json = await response.json();

                game.loadPgn(json.pgn);
                game.setHeader("White", json.white);
                setWhite(json.white);
                game.setHeader("Black", json.black);
                setBlack(json.black);
                setPgn(json.pgn);
                setPosition(json.fen);
            } catch(error) {
                console.error(error.message);
            }
        }

        client.activate();
        fetchGame();

        return () => {
            client.deactivate();
        };
    }, []);

    function canDragPiece({ piece }) {
        const game = chessGameRef.current;
        return canInteractWithPiece({ piece }) && game.turn() === piece.pieceType[0];
    }

    function canInteractWithPiece() {
        const game = chessGameRef.current;
        if (game.getHeaders().Result !== "*")
            return false;
        if (player.username !== game.getHeaders().White && player.username !== game.getHeaders().Black)
            return false;
        if (game.turn() === "w" && color !== "white")
            return false;
        if (game.turn() === "b" && color !== "black")
            return false;
        return true;
    }

    function onPieceDrag({ square }) {
        const game = chessGameRef.current;
        if (game.turn() === game.get(square).color)
            getAndSetPossibleMoves(square);
    }

    function getAndSetPossibleMoves(square) {
        const game = chessGameRef.current;

        const moves = game.moves({ square: square, verbose: true });

        if (moves.length === 0) {
            setSquareOptions({});
            return;
        }

        setPossibleMoves(moves);
        const updatedSquares = {};
        for (const move of moves) {
            const color = game.squareColor(move.to) === "dark" ? "rgb(60,97,134)" : "rgb(168,170,178)";

            updatedSquares[move.to] = {
                background:
                    game.get(move.to) &&
                    game.get(move.to)?.color !== game.get(square)?.color
                        ? "radial-gradient(circle, " + color + " 85%, transparent 85%)" // larger circle for capturing
                        : "radial-gradient(circle, " + color + " 20%, transparent 20%)", // smaller circle for moving
                borderRadius: "50%",
            };
        }
        updatedSquares[square] = { boxShadow: "inset 0px 0px 0px 1px black" };
        setSquareOptions(updatedSquares);
    }

    async function onPieceDrop({ sourceSquare, targetSquare })
    {
        const game = chessGameRef.current;

        if (!targetSquare)
            return false;

        if (isValidMove(sourceSquare, targetSquare) && isPromotionMove(sourceSquare, targetSquare)) {
            setPromotionMove({ sourceSquare, targetSquare, turn: game.turn() });
            setSquareOptions({});
            setPossibleMoves([]);
            return true;
        }

        try {
            game.move({ from: sourceSquare, to: targetSquare });
            checkGameOver();
            setPgn(game.pgn());
            setPosition(game.fen());
            setSquareOptions({});
            setPossibleMoves([]);

            await sendMove(game, sourceSquare, targetSquare);

            return true;
        } catch {
            return false;
        }
    }

    async function sendMove(game, sourceSquare, targetSquare) {

        const response = await fetch("http://localhost:8080/games/" + params.gameId + "/move", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + player.password
            },
            body: JSON.stringify({
                color: (game.turn() === "w" ? "b" : "w"),
                from: sourceSquare,
                to: targetSquare,
                pgn: game.pgn(),
                fen: game.fen()
            })
        })

        if (!response.ok) {
            game.undo();
            setPgn(game.pgn());
            setPosition(game.fen());
        }
    }

    function isValidMove(source, target) {
        const game = chessGameRef.current;
        try {
            game.move({from: source, to: target, promotion: "q" });
            game.undo();
            return true;
        } catch {
            return false;
        }
    }

    async function onSquareClick({ square, piece })
    {
        if (!canInteractWithPiece(piece))
            return;

        const game = chessGameRef.current;

        if (possibleMoves.length !== 0) {
            for (const move of possibleMoves) {
                if (square === move.to) {
                    if (isPromotionMove(move.from, move.to)) {
                        setPromotionMove({ sourceSquare: move.from, targetSquare: square, turn: game.turn() });
                        setSquareOptions({});
                        setPossibleMoves([]);
                        return;
                    }
                    game.move({ from: move.from, to: move.to })
                    checkGameOver();
                    setPgn(game.pgn());
                    setPosition(game.fen());

                    await sendMove(game, move.from, move.to);
                } else {
                    getAndSetPossibleMoves(square);
                }
            }
            setSquareOptions({});
            setPossibleMoves([]);
            setPromotionMove(null);
        } else if (piece === null) {
            setPromotionMove(null);
        }

        getAndSetPossibleMoves(square);
    }

    function isPromotionMove(sourceSquare, targetSquare) {
        const game = chessGameRef.current;
        return game.get(sourceSquare).type === "p" && (targetSquare[1] === "8" || targetSquare[1] === "1");
    }

    function promote(piece) {
        const game = chessGameRef.current;

        try {
            game.move({
                from: promotionMove.sourceSquare,
                to: promotionMove.targetSquare,
                promotion: piece
            });
            setPosition(game.fen());
        } catch {
            // do nothing
        }
        setPromotionMove(null);
    }

    const squareSizeLength =
        document
            .querySelector(`[data-column="a"][data-row="1"]`)
            ?.getBoundingClientRect()?.width ?? 0;

    const chessboardOptions = {
        boardStyle: { maxWidth: "648px", minWidth: "460px" },
        alphaNotationStyle: { fontSize: "14px", fontWeight: 500 },
        numericNotationStyle: { fontSize: "14px", fontWeight: 500 },
        lightSquareNotationStyle: { color: "#578cc1" },
        lightSquareStyle: { backgroundColor: "#ffffff" },
        darkSquareStyle: { backgroundColor: "#578cc1" },
        boardOrientation: color,

        allowDragOffBoard: false,
        draggingPieceGhostStyle: { opacity: 0 },
        dropSquareStyle: { boxShadow: "inset 0px 0px 0px 0px black", },
        draggingPieceStyle: { transform: "scale(1)" },
        dragActivationDistance: 1,
        showAnimations: false,

        canDragPiece,
        onPieceDrag,
        onPieceDrop,
        onSquareClick,

        position: position,
        squareStyles: squareOptions,
    };

    return (
        position ? (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    <Chessboard options={chessboardOptions} />

                    {promotionMove ? (
                        <div id="promotionMenu" style={{ height: squareSizeLength }}>
                            {(["q", "r", "n", "b"]).map((piece) => (
                                <button id="promotionOptions"
                                    key={piece}
                                    onClick={() => {
                                        promote(piece);
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    {defaultPieces[`${promotionMove.turn}${piece.toUpperCase()}`]()}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "400px",
                        gap: 16
                    }}
                >
                    { (pgn || (white && black)) &&
                        <Card sx={{ ml: 2, p: 1 }} >
                            <Typography>White: {white}</Typography>
                            <Typography>Black: {black}</Typography>
                            <Divider sx={{width: "100%", my: 1.5, borderColor: "#424548"}}/>
                            <Typography>{pgn.split(/\n\s*\n/).pop()}</Typography>
                        </Card>
                    }

                    <GameDebug
                        chessGameRef = {chessGameRef}
                        position = {position}
                        setSquareOptions = {setSquareOptions}
                        setPromotionMove = {setPromotionMove}
                        setChessPosition = {setPosition}
                        setPgn = {setPgn}
                    />
                </div>
            </div>
        ) : (
            <LoadingText>Loading game...</LoadingText>
        )
    )
}