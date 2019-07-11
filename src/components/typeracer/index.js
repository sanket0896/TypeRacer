import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';
import './index.css';
import GameOver from '../gameover/gameover';

class Typeracer extends PureComponent{

    TIMER_ID = 0;

    state={
        timer: 0,
        displaytext: '',
        typedWord: '',
        incompleteWords: [],
        completeWords: [],
        typeMismatch: false,
        correctLetters: '',
        incorrectLetter: '',
        gameStarted: false,
        gameOver: false,
    }

    componentDidMount = () => {
        let result;
        axios.get('http://www.randomtext.me/api/')
        .then(res => {
            result = res.data.text_out.split('<p>').join('').split('</p>').join('');
            console.log(result);
            this.setState({
                displaytext: res.data.text_out,
                incompleteWords: result.split(' ')
            });
        })
    }

    componentDidUpdate = () => {
        if(this.state.incompleteWords.length === 0){
            // Game over
            this.setState({gameOver: true});
            clearInterval(this.TIMER_ID);
        }
    }

    componentWillMount = () => {
        clearInterval(this.TIMER_ID);
    }

    tick = () => {
        this.setState(prevState => ({
            timer: prevState.timer + 1
        }));
    }

    startTimer = () => {
        this.TIMER_ID = setInterval(this.tick, 1000);
    }

    // Logic for checking equality
    checkEquality = () => {
        const lastChar = this.state.typedWord.substr(-1);
        const trimmedWord = this.state.typedWord.trimEnd();
        const correctWord = this.state.incompleteWords[0];

        if(trimmedWord === this.state.incompleteWords[0]){
            if(lastChar === ' ' || this.state.incompleteWords.length === 1){
                this.setState(prevState => ({
                    typedWord: '',
                    correctLetters: '',
                    completeWords: [...prevState.completeWords, prevState.incompleteWords[0]],  
                    incompleteWords: prevState.incompleteWords.slice(1)
                }))
                return;
            }
        }

        if(correctWord.startsWith(trimmedWord)){
            this.setState({
                typeMismatch: false,
                correctLetters: trimmedWord,
                incorrectLetter: ''
            });
        }else{
            this.setState(prevState => ({
                typeMismatch: true,
                incorrectLetter: correctWord[prevState.correctLetters.length]
            }));
        }
    }

    handleChange = (event) => {
        if(!this.state.gameStarted){
            this.startTimer();
            this.setState({
                gameStarted: true
            })
        }
        if(!this.state.gameOver){
            this.setState({
                typedWord: event.target.value
            }, this.checkEquality);
        }
    }

    render(){
        return( 
        <Fragment>
            {
                this.state.gameOver ? 
                    <GameOver wordCount={this.state.completeWords.length} time={this.state.timer} />
                :
                <Fragment>
                    <div style={{fontWeight: 'bold'}}>
                        <span style={{color: 'green'}}>{this.state.completeWords.join(' ')} {this.state.correctLetters}</span>
                        <span style={{color: 'red'}}>{this.state.incorrectLetter}</span>
                        <span style={{color: 'black'}}>{this.state.incompleteWords[0] && (this.state.typeMismatch ? this.state.incompleteWords[0].slice(this.state.correctLetters.length+1) : this.state.incompleteWords[0].slice(this.state.correctLetters.length))} {this.state.incompleteWords.slice(1).join(' ')}</span>
                    </div>
                    {!this.state.gameStarted && <p>Game starts when you start typing in the box below</p>}
                    <input type="text" value={this.state.typedWord} onChange={this.handleChange} className={this.state.typeMismatch ? 'type-mismatch' : ''}></input>
                </Fragment>
            }
            </Fragment>
        );
    }
}

export default Typeracer;