(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{27:function(e,t,a){e.exports=a(28)},28:function(e,t,a){"use strict";a.r(t);var n=a(20),r=a(21),l=a(25),c=a(22),o=a(1),s=a(26),i=a(0),u=a.n(i),d=a(23),m=a.n(d),h=a(24);function v(){return(v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}var f=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(l.a)(this,Object(c.a)(t).call(this,e))).state={board:a.createBoard(),holochainConnection:Object(h.connect)(),connected:!1,user:{},playerOneTurn:!1,lastColClicked:null,gameOver:!1,reset:!1},a.handleClick=a.handleClick.bind(Object(o.a)(a)),a.updateBoard=a.updateBoard.bind(Object(o.a)(a)),a.checkScore=a.checkScore.bind(Object(o.a)(a)),a.arrows=a.arrows.bind(Object(o.a)(a)),a.handleReset=a.handleReset.bind(Object(o.a)(a)),a.resetState=a.resetState.bind(Object(o.a)(a)),a.onClick=a.onClick.bind(Object(o.a)(a)),a}return Object(s.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.state.holochainConnection.then(function(t){var a=t.callZome;t.call;e.setState({connected:!0}),a("connect-4","main","whoami")({}).then(function(e){console.log("result: ",e)}).catch(function(e){console.log("error: ",e)})})}},{key:"createBoard",value:function(){return Array(6).fill().map(function(e){return Array(7).fill(null)})}},{key:"updateBoard",value:function(e,t){var a=e.board.slice(),n=a.slice().reverse().filter(function(e){return null===e[t]})[0],r=a.indexOf(n);return a[r][t]=!0===e.playerOneTurn?"playerone":"playertwo",a}},{key:"checkScore",value:function(e,t){for(var a=t?"playerone":"playertwo",n=0;n<e[0].length-3;n++)for(var r=0;r<e.length;r++)if(e[r][n]===a&&e[r][n+1]===a&&e[r][n+2]===a&&e[r][n+3]===a)return"".concat(a," wins across!!!");for(var l=0;l<e[0].length;l++)for(var c=0;c<e.length-3;c++)if(e[c][l]===a&&e[c+1][l]===a&&e[c+2][l]===a&&e[c+3][l]===a)return"".concat(a," wins vertically!!!");for(var o=0;o<e[0].length-3;o++)for(var s=0;s<e.length-3;s++)if(e[s][o]===a&&e[s+1][o+1]===a&&e[s+2][o+2]===a&&e[s+3][o+3]===a)return"".concat(a," wins diagonally!!!");for(var i=0;i<e[0].length-3;i++)for(var u=3;u<e.length;u++)if(e[u][i]===a&&e[u-1][i+1]===a&&e[u-2][i+2]===a&&e[u-3][i+3]===a)return"".concat(a," wins diagonally!!!");return!1}},{key:"handleClick",value:function(e){var t=this;this.setState(function(a){t.makeMove(e)})}},{key:"arrows",value:function(){var e=this;return Array(7).fill().map(function(t,a){var n=!e.state.board.map(function(e){return e[a]}).some(function(e){return null===e});return u.a.createElement(k,{key:a,colIndex:a,handleClick:e.handleClick,gameOver:e.state.gameOver,colFull:n,reset:e.state.reset})})}},{key:"resetState",value:function(){this.setState({board:this.createBoard(),playerOneTurn:!0,lastColClicked:null,gameOver:!1,reset:!1})}},{key:"handleReset",value:function(){this.setState({reset:!0}),setTimeout(this.resetState,1400)}},{key:"onClick",value:function(){console.log("clicked start game button")}},{key:"render",value:function(){return u.a.createElement("div",null,u.a.createElement(p,{playerOneTurn:this.state.playerOneTurn,gameOver:this.state.gameOver,onClick:this.startGame}),u.a.createElement("div",{className:"container"},u.a.createElement(E,{style:{height:"20px",marginBottom:"40px",marginLeft:"20px"}},this.arrows()),u.a.createElement(y,v({},this.state,{handleReset:this.handleReset}))))}}]),t}(u.a.Component),p=function(e){var t=e.playerOneTurn,a=e.gameOver,n=e.onClick,r=e.agentAddress,l=void 0===r?"":r,c=e.gameAddress,o=void 0===c?"":c;return u.a.createElement("div",null,a?u.a.createElement("h1",{className:"game-over"},a.split("player").join("player ")):u.a.createElement("div",{className:"header"},u.a.createElement("h1",{className:"title"},"HC Connect 4"),u.a.createElement("h1",{className:t?"player-change":"hide-player"},"Player ",u.a.createElement("span",{className:"red"},"One")," Go!"),u.a.createElement("h1",{className:t?"hide-player":"player-change"},"Player ",u.a.createElement("span",{className:"black"},"Two")," Go!")),u.a.createElement("p1",{className:"subtitle"},"Start game with opponent address: ",l),u.a.createElement("input",{placeholder:"Opponent Address",type:"string",autoFocus:!0}),u.a.createElement("button",{onClick:n,disabled:!1},"Start Game"),u.a.createElement("h1",{className:"subtitle"},"Agent Address: ",l),u.a.createElement("h1",{className:"subtitle"},"Game Address: ",o))},y=function(e){var t=e.board,a=e.reset,n=e.handleReset,r=function(e){return function(n,r){return u.a.createElement(b,{key:r,player:t[e][r],reset:a})}},l=function(e,t){return Array(t).fill().map(e)};return u.a.createElement("div",{className:"board-holder"},u.a.createElement("div",{className:"board"},l(function(e,t){return u.a.createElement(E,{key:t},l(r(t),7))},6)),u.a.createElement(g,{handleReset:n,lever:!0}))},b=function(e){var t=e.player,a=e.reset;return u.a.createElement("div",{className:"space"},null!==t&&u.a.createElement("div",{className:"chip player-drop",style:function(){var e={};return e.background="playerone"===t?"red":"black",console.log(a),a&&(e.animation="clearboard 1.5s linear"),e}()}))},k=function(e){var t=e.colIndex,a=e.handleClick,n=e.gameOver,r=e.colFull,l=e.reset;return n||l?null:u.a.createElement("i",{className:"fa fa-arrow-circle-down arrow",style:r?{visibility:"hidden"}:{},onClick:function(){return a(t)}})},g=function(e){var t=e.handleReset,a=e.lever;return u.a.createElement("div",{className:"reset-container"},a?u.a.createElement("div",{className:"lever-container"},u.a.createElement("div",{className:"lever-text"},"Reset ",u.a.createElement("i",{className:"fa fa-arrow-right","aria-hidden":"true"})),u.a.createElement("div",{className:"lever",onClick:t})):u.a.createElement("button",{className:"reset-button",onClick:t},u.a.createElement("i",{className:"fa fa-refresh"})))},E=function(e){return u.a.createElement("div",{className:"row",style:e.style},e.children)};m.a.render(u.a.createElement(f,null),document.getElementById("root"))}},[[27,1,2]]]);
//# sourceMappingURL=main.d2a4ed58.chunk.js.map