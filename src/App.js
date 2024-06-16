import './App.css';

import React, { useState, useEffect } from 'react';
import Lottie, {LottieRefCurrentProps} from "lottie-react"
import xAnimationData from "./assets/x.json"
import oAnimationData from "./assets/zero.json"
import {useRef} from "react"

let sign = "X";
let moves = 0;

const DeviceWidth = window.innerWidth;

function App() {
    const xAnimationRef = useRef<LottieRefCurrentProps>(null);
    const oAnimationRef = useRef<LottieRefCurrentProps>(null);

    const [deviceWidth, setDeviceWidth] = useState(DeviceWidth * 0.1) ;
    const [winner, setWinner] = useState(null);
    const [board, setBoard] = useState(Array(9).fill('')); // State for board values

    useEffect(() => {
        const handleResize = () => setDeviceWidth(window.innerWidth * 0.1); // Scale with resize
        window.addEventListener('resize', handleResize);

        const currentWinner = checkWinner();
        if(checkWinner()){
            setWinner(currentWinner);
            console.log(winner);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [board]);

    const placeSign = (index) => {
        if (board[index] === '' && !checkWinner()) { // Prevent clicking filled cells
            const newBoard = [...board];
            newBoard[index] = sign;
            setBoard(newBoard);
            sign = (sign === "X") ? "O" : "X";
            moves++;
        }

    }

    // Function to determine if there is a winner (simplified for brevity)
    const checkWinner = () => {
        let sum,i, j;

        // lines
        for(j = 0; j < 3; j++){
            sum = 0;
            for(i = 0; i < 3; i++){
                if(board[j*3+i] == "X"){ sum ++; }
                if(board[j*3+i] == "O"){ sum --; }
            }
            if(sum == 3){ return "X"; }
            if(sum == -3){ return "O"; }
        }

        // columns
        for(j = 0; j < 3; j++){
            sum = 0;
            for(i = 0; i < 3; i++){
                if(board[j+i*3] == "X"){ sum ++; }
                else if(board[j+i*3] == "O"){ sum --; }
            }
            if(sum == 3){ return "X"; }
            if(sum == -3){ return "O"; }
        }

        // principal diagonal
        sum = 0;
        for(i = 0; i <= 8; i = i + 4){
            if(board[i] == "X"){ sum ++; }
            if(board[i] == "O"){ sum --; }
        }
        if(sum == 3){ return "X"; }
        if(sum == -3){ return "O"; }

        // secondary diagonal
        sum = 0;
        for(i = 2; i <= 6; i = i + 2) {
            if (board[i] == "X") { sum++; }
            if (board[i] == "O") { sum--; }
        }
        if(sum == 3){ return "X"; }
        if(sum == -3){ return "O"; }

        if(moves == 9){
            return "None";
        }
        return false;
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="grid">
                    {[0, 3, 6].map((rowStart) => (
                        <div key={rowStart} className="row">
                            {board.slice(rowStart, rowStart + 3).map((cell, index) => (
                                <div
                                    key={rowStart + index}
                                    id={`cell${rowStart + index}`}
                                    onClick={() => placeSign(rowStart + index)}
                                    style={{
                                        width: deviceWidth,
                                        height: deviceWidth,
                                        backgroundColor: '#00000',
                                        display: 'flex', // Center content within the cell
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: deviceWidth * 0.8, // Scale font size dynamically
                                        border: '2px solid black',
                                    }}
                                >
                                    {cell === 'X' ? (
                                        <Lottie lottieRef={xAnimationRef} onComplete={() => {
                                            oAnimationRef.current.destroy();
                                        }} animationData={xAnimationData} isStopped={true} style={{ width: 150, height: 150, display: 'flex' }} />
                                    ) : cell === 'O' ? (
                                        <Lottie LottieRef={oAnimationRef} onComplete={() => {
                                            oAnimationRef.current.destroy();
                                        }}  animationData={oAnimationData} isStopped={true} style={{ width: 130, height: 130, display: 'flex' }} />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {winner && (
                    <div>
                        <h2>
                            {winner === "X" ? 'X won' : (winner === "O" ? 'O won' : 'No one won')}
                        </h2>
                    </div>
                )}
            </header>

        </div>
    );
}

export default App;
