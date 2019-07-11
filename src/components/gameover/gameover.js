import React from 'react';

const GameOver = ({wordCount, time}) => (
    <div>
        <h1>Game Over</h1>
        <h3>Your score: {(wordCount/(time || 1)*60)} words per minute</h3>
    </div>
);

export default GameOver;