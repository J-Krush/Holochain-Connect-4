import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from '@holochain/hc-web-client'
function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);}
const { Component } = React;

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      // holochainConnection: connect('ws://localhost:3001'),
      holochainConnection: connect(), // use when letting the conductor auto-select. Allows for multiple agents
      connected: false,
      user: {},
      playerOneTurn: false,
      lastColClicked: null,
      gameOver: false,
      reset: false };


    this.handleClick = this.handleClick.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.checkScore = this.checkScore.bind(this);
    this.arrows = this.arrows.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.resetState = this.resetState.bind(this);

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {

    this.state.holochainConnection.then(({ callZome, call }) => {
      this.setState({ connected: true })
      callZome('connect-4', 'main', 'whoami')({}).then((result) => {
        console.log('result: ', result);
      })
      .catch ((e) => {
        console.log('error: ', e);
      });
    });
    // this.makeHolochainCall('connect-4/main/whoami', (result) => {
    //   console.log('who am i? ', result)
    // })
  }

  createBoard() {
    return Array(6).fill().map(arr => Array(7).fill(null));
  }

  updateBoard(prevState, colIndex) {
    const board = prevState.board.slice();
    const row = board.slice().reverse().filter(row => row[colIndex] === null)[0];
    const rowIndex = board.indexOf(row);
    board[rowIndex][colIndex] = prevState.playerOneTurn === true ? 'playerone' : 'playertwo';
    return board;
  }

  checkScore(board, playerOneTurn) {
    const player = playerOneTurn ? 'playerone' : 'playertwo';

    for (let c = 0; c < board[0].length - 3; c++) {
      for (let r = 0; r < board.length; r++) {
        if (board[r][c] === player && board[r][c + 1] === player && board[r][c + 2] === player && board[r][c + 3] === player) {
          return `${player} wins across!!!`;
        }
      }
    }

    for (let c = 0; c < board[0].length; c++) {
      for (let r = 0; r < board.length - 3; r++) {
        if (board[r][c] === player && board[r + 1][c] === player && board[r + 2][c] === player && board[r + 3][c] === player) {
          return `${player} wins vertically!!!`;
        }
      }
    }

    for (let c = 0; c < board[0].length - 3; c++) {
      for (let r = 0; r < board.length - 3; r++) {
        if (board[r][c] === player && board[r + 1][c + 1] === player && board[r + 2][c + 2] === player && board[r + 3][c + 3] === player) {
          return `${player} wins diagonally!!!`;
        }
      }
    }

    for (let c = 0; c < board[0].length - 3; c++) {
      for (let r = 3; r < board.length; r++) {
        if (board[r][c] === player && board[r - 1][c + 1] === player && board[r - 2][c + 2] === player && board[r - 3][c + 3] === player) {
          return `${player} wins diagonally!!!`;
        }
      }
    }

    return false;
  }

  handleClick(colIndex) {
    this.setState(prevState => {

      this.makeMove(colIndex);
    //   const board = this.updateBoard(prevState, colIndex);
    //
    //   const gameOver = this.checkScore(board, prevState.playerOneTurn);
    //
    //   return {
    //     board,
    //     playerOneTurn: !this.state.playerOneTurn,
    //     lastColClicked: colIndex,
    //     gameOver };
    //
    // });
    })
  }

  arrows() {
    return Array(7).fill().map((_, i) => {
      const colFull = !this.state.board.map(row => row[i]).some(item => item === null);

      return React.createElement(Arrow, {
        key: i,
        colIndex: i,
        handleClick: this.handleClick,
        gameOver: this.state.gameOver,
        colFull: colFull,
        reset: this.state.reset });

    });
  }

  resetState() {
    this.setState({
      board: this.createBoard(),
      playerOneTurn: true,
      lastColClicked: null,
      gameOver: false,
      reset: false });

  }

  handleReset() {
    this.setState({ reset: true });
    setTimeout(this.resetState, 1400);
  }

  onClick() {
    console.log('clicked start game button');
  };

  // ******************** HOLOCHAIN STUFF ******************** //

  // startGame(opponentAddress) {
  //   this.makeHolochainCall('connect-4/main/new_game', {
  //     address: opponentAddress,
  //   }, (result) => {
  //     console.log('created game', result)
  //   })
  // }
  //
  // makeMove(column) {
  //       // const message = {
  //       //   // game: Address,
  //       // 	// move_type: MoveType,
  //       // 	// timestamp: u32,
  //       //   game: Address,
  //       // 	move_type: MoveType,
  //       // 	timestamp: Math.floor(Date.now() / 1000),
  //       // }
  //       this.makeHolochainCall('connect-4/main/make_move', {
  //         DropPiece: {
  //           column: column,
  //         }
  //       }, (result) => {
  //         console.log('move made', result)
  //       })
  //     }
  //
  // makeHolochainCall (callString, params, callback) {
  //   const [instanceId, zome, func] = callString.split('/')
  //   this.state.holochainConnection.then(({ callZome }) => {
  //     callZome(instanceId, zome, func)(params).then((result) => callback(JSON.parse(result)))
  //   })
  // }


  // ****************** END OF HOLOCHAIN STUFF ****************** //

  render() {
    return (
      React.createElement("div", null,
      React.createElement(Header, { playerOneTurn: this.state.playerOneTurn, gameOver: this.state.gameOver, onClick: this.startGame }),
      React.createElement("div", { className: "container" },
      React.createElement(Row, { style: { height: '20px', marginBottom: '40px', marginLeft: '20px' } },
      this.arrows()),

      React.createElement(Board, _extends({}, this.state, { handleReset: this.handleReset })))));



  }

}


const Header = ({ playerOneTurn, gameOver, onClick, agentAddress = '', gameAddress = '' }) => {
  return (
    React.createElement("div", null,
    !gameOver ?
    React.createElement("div", { className: "header" },
    React.createElement("h1", { className: "title" }, "HC Connect 4"),
    React.createElement("h1", { className: playerOneTurn ? 'player-change' : 'hide-player' }, "Player ", React.createElement("span", { className: "red" }, "One"), " Go!"),
    React.createElement("h1", { className: !playerOneTurn ? 'player-change' : 'hide-player' }, "Player ", React.createElement("span", { className: "black" }, "Two"), " Go!")) :
    React.createElement("h1", { className: "game-over" }, gameOver.split('player').join('player ')),

    React.createElement("p1", { className: "subtitle" }, "Start game with opponent address: ", agentAddress),

    React.createElement('input', { placeholder: 'Opponent Address', type: 'string', autoFocus: true }),

    React.createElement( "button", { onClick: onClick, disabled: false }, "Start Game"),

    React.createElement("h1", { className: "subtitle" }, "Agent Address: ", agentAddress),
    React.createElement("h1", { className: "subtitle" }, "Game Address: ", gameAddress)));
    // React.createElement(Reset, { handleReset: handleReset, lever: false })));


};



const Board = ({ board, reset, handleReset }) => {
  const rows = (_, i) => {
    return (
      React.createElement(Row, { key: i },
      rowOutput(spaces(i), 7)));


  };

  const spaces = rowIndex => {
    return (_, i) => {
      return React.createElement(Space, { key: i, player: board[rowIndex][i], reset: reset });
    };
  };

  const rowOutput = (row, num) => {
    return Array(num).fill().map(row);
  };

  return (
    React.createElement("div", { className: "board-holder" },
    React.createElement("div", { className: "board" },
    rowOutput(rows, 6)),

    React.createElement(Reset, { handleReset: handleReset, lever: true })));


};

const Space = ({ player, reset }) => {
  const background = () => {
    const style = {};
    style.background = player === 'playerone' ? 'red' : 'black';

    console.log(reset);
    if (reset) {
      style.animation = 'clearboard 1.5s linear';
    }
    return style;
  };

  return (
    React.createElement("div", { className: "space" },
    player !== null &&
    React.createElement("div", { className: "chip player-drop", style: background() })));



};

const Arrow = ({ colIndex, handleClick, gameOver, colFull, reset }) => {
  function sendKey() {
    return handleClick(colIndex);
  }

  function columnFull() {
    return colFull ? { visibility: 'hidden' } : {};
  }

  if (!gameOver && !reset) {
    return React.createElement("i", { className: "fa fa-arrow-circle-down arrow", style: columnFull(), onClick: sendKey });
  } else {
    return null;
  }
};

const Reset = ({ handleReset, lever }) => {
  return (
    React.createElement("div", { className: "reset-container" },
    lever ?
    React.createElement("div", { className: "lever-container" },
    React.createElement("div", { className: "lever-text" }, "Reset ",
    React.createElement("i", { className: "fa fa-arrow-right", "aria-hidden": "true" })),

    React.createElement("div", { className: "lever", onClick: handleReset })) :


    React.createElement("button", { className: "reset-button", onClick: handleReset },
    React.createElement("i", { className: "fa fa-refresh" }))));




};

const Row = props => {
  return (
    React.createElement("div", { className: "row", style: props.style },
    props.children));


};

ReactDOM.render(React.createElement(Container, null), document.getElementById('root'));
