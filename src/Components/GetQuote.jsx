import React, { Component } from "react";
import axios from "axios";

export default class GetQuote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wisdom: "",
      size: ""
    };
  }

  handleGetWisdom = async () => {
    if (this.state.size.length > 0) {
      console.log("Getting wisdom...");
      // hit API and set quote on this.state.wisdom
      axios
        .get(`https://ron-swanson-quotes.herokuapp.com/v2/quotes`)
        .then(response => {
          console.log(response.data[0]);
          console.log(this.state.wisdom);
          let numWords = response.data[0].split(" ");
          console.log(numWords);
          
          //If small
          if (this.state.size === "small") {
            if (
              numWords.length <= 3 &&
              response.data[0] !== this.state.wisdom
            ) {
              this.setState({ wisdom: response.data[0] });
            } else {
              this.handleGetWisdom();
            }
            //If medium
          } else if (this.state.size === "medium") {
            if (
              numWords.length > 3 &&
              numWords.length < 13 &&
              response.data[0] !== this.state.wisdom
            ) {
              this.setState({ wisdom: response.data[0] });
            } else {
              this.handleGetWisdom();
            }
            //If large
          } else if (this.state.size === "large") {
            if (
              numWords.length > 12 &&
              response.data[0] !== this.state.wisdom
            ) {
              this.setState({ wisdom: response.data[0] });
            } else {
              this.handleGetWisdom();
            }
          }
        });
    }
  };

  handleSize = async e => {
    await this.setState({ size: e.target.value });
    console.log("Wisdom size: ", this.state.size);
  };

  render() {
    let wisdom;
    if (this.state.wisdom.length > 0) {
      wisdom = <p>"{this.state.wisdom}"</p>;
    }
    return (
      <div>
        <select
          name=""
          onChange={e => {
            this.handleSize(e);
          }}
        >
          <option value="">
            Select the amount of Wisdom you would like...
          </option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <img
          src="https://pbs.twimg.com/profile_images/3280677683/0ca071f08032e65c1b268b1cf56466ef_400x400.jpeg"
          alt=""
        />
        <button onClick={this.handleGetWisdom}>
          Today's your lucky day, as I am now going to share with you my wisdom.
        </button>
        {wisdom}
      </div>
    );
  }
}
