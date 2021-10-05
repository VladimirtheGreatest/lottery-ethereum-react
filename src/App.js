import "./App.css";
import React from "react";
import lottery from "./lottery";
import web3 from "./web3";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }
  //we dont need to worry about the value of this
  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
  };
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}
          There are currently {this.state.players.length} players entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether!
        </p>
        <hr></hr>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            ></input>
          </div>
          <button>Enter</button>
        </form>
      </div>
    );
  }
}
export default App;
