import React, { Component } from "react";

export default class GetQuote extends Component {
    constructor(props){
        super(props)
        this.state = {
            wisdom: 'Test wisdom'
        }
    }

    handleGetWisdom = () =>{
        console.log('Getting wisdom...')
        // hit API and set quote on this.state.wisdom
    }

  render() {
      let wisdom;
      if (this.state.wisdom.length > 0){
          wisdom = (
              <p>
                  {this.state.wisdom}
              </p>
          )
      }
    return (
      <div>
        <img src="https://pbs.twimg.com/profile_images/3280677683/0ca071f08032e65c1b268b1cf56466ef_400x400.jpeg" alt="" />
        <button onClick={this.handleGetWisdom}>
          Today's your lucky day. I'm going to share with you my wisdom.
        </button>
        {wisdom}
      </div>
    );
  }
}
