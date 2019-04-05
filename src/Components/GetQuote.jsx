import React, { Component } from "react";
import axios from "axios";

export default class GetQuote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wisdom: "",
      size: "",
      isLoading: false,
      usersRating: 0,
      newRating: 0,
      ratingAvg: 0
    };
  }

  // Get correct size quote and rating info
  handleGetWisdom = async () => {
    if (this.state.size.length > 0) {
      console.log("Getting wisdom...");
      await this.setState({ isLoading: true, usersRating: 0, newRating: 0 });

      // hit API and set quote on this.state.wisdom
      await axios
        .get(`https://ron-swanson-quotes.herokuapp.com/v2/quotes`)
        .then(response => {
          let numWords = response.data[0].split(" ");

          //If small
          if (this.state.size === "small") {
            if (
              numWords.length <= 3 &&
              response.data[0] !== this.state.wisdom
            ) {
              this.setState({
                wisdom: `"${response.data[0]}"`,
                isLoading: false
              });
              //GET user's rating
              axios
                .get(`/api/get-users-rating/${response.data[0]}`)
                .then(res => {
                  console.log("res.data: ", res.data);
                  console.log("UsersRating before: ", this.state.usersRating)
                  if (res.data.length > 0) {
                    console.log("usersRating", res.data[0].rating)
                    this.setState({ usersRating: res.data[0].rating });
                  }
                  console.log("UsersRating after: ", this.state.usersRating)
                })
                .then(
                  //GET rating average
                  axios
                    .get(`/api/get-rating-avg/${response.data[0]}`)
                    .then(res => {
                      console.log("Rating Average: ", res.data[0].round);
                      this.setState({ ratingAvg: res.data[0].round });
                    })
                );
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
              this.setState({
                wisdom: `"${response.data[0]}"`,
                isLoading: false
              });
              //GET user's rating
              axios
                .get(`/api/get-users-rating/${response.data[0]}`)
                .then(res => {
                  console.log("res.data: ", res.data);
                  if (res.data.length > 0) {
                    this.setState({ usersRating: res.data[0].rating });
                  }
                })
                .then(
                  //GET rating average
                  axios
                    .get(`/api/get-rating-avg/${response.data[0]}`)
                    .then(res => {
                      console.log("Rating Average: ", res.data[0].round);
                      this.setState({ ratingAvg: res.data[0].round });
                    })
                );
            } else {
              this.handleGetWisdom();
            }
            //If large
          } else if (this.state.size === "large") {
            if (
              numWords.length > 12 &&
              response.data[0] !== this.state.wisdom
            ) {
              this.setState({
                wisdom: `"${response.data[0]}"`,
                isLoading: false
              });
              //GET user's rating
              axios
                .get(`/api/get-users-rating/${response.data[0]}`)
                .then(res => {
                  console.log("res.data: ", res.data);
                  if (res.data.length > 0) {
                    this.setState({ usersRating: res.data[0].rating });
                  }
                })
                .then(
                  //GET rating average
                  axios
                    .get(`/api/get-rating-avg/${response.data[0]}`)
                    .then(res => {
                      console.log("Rating Average: ", res.data[0].round);
                      this.setState({ ratingAvg: res.data[0].round });
                    })
                );
            } else {
              this.handleGetWisdom();
            }
          }
        });
      // Notify user why quote wasn't generated
    } else {
      window.alert(
        "Follow the instructions I gave you and select a size first."
      );
    }
  };

  // Set Size selection to state
  handleSize = async e => {
    await this.setState({ size: e.target.value });
  };

  // Set users new rating to state
  handleRating = async e => {
    await this.setState({ newRating: e.target.value });
  };

  // Submit users new rating to DB
  handleSubmitRating = async () => {
    // Determine user has selected a valid rating
    if (this.state.newRating > 0) {
      // Send rating to backend
      await axios.post(
        `/api/new-rating/${this.state.newRating}/${this.state.wisdom}`
      );
      // update State with new rating to get rid of submit button
      this.setState({ usersRating: this.state.newRating });
      //  GET the new average rating for the quote
      axios.get(`/api/get-rating-avg/${this.state.wisdom}`).then(res => {
        this.setState({ ratingAvg: res.data[0].round });
      });
      // Notify user why rating wasn't submitted
    } else window.alert("Your rating can not be nothing.");
  };

  render() {
    // wisdom-container should be empty by default
    let wisdom = <div className="wisdom-container" />;
    // rating default
    let rating = (
      <div className="ratings">
        <h5 className="rating-avg">
          Average rating:{" "}
          {/* Have to check typeof ratingAvg because if there aren't any ratings for the quote, the db returns {round: null} */}
          {typeof this.state.ratingAvg === "string"
            ? this.state.ratingAvg
            : "-"}
          /5
        </h5>
        <input
          type="number"
          min="1"
          max="5"
          onChange={e => {
            this.handleRating(e);
          }}
        />
        /5
        <button onClick={this.handleSubmitRating}>Submit Rating</button>
      </div>
    );

    //Conditional rating render when quote already rated by user
    if (this.state.usersRating > 0) {
      rating = (
        <div className="ratings">
          <h5 className="rating-avg">
            Average rating:{" "}
            {typeof this.state.ratingAvg === "string"
              ? this.state.ratingAvg
              : "-"}
            /5
          </h5>
          <h5 className="rating-avg">
            Your rating: {this.state.usersRating}/5
          </h5>
        </div>
      );
    }

    //Conditional wisdom render
    if (this.state.wisdom.length > 0) {
      wisdom = (
        <div className="wisdom-container">
          <p>{this.state.wisdom}</p>
          {rating}
        </div>
      );
    }

    //Render loading que while fetching quote
    if (this.state.isLoading === true) {
      wisdom = (
        <div className="wisdom-container">
          <p className="loading">RETRIEVING WISDOM...</p>
        </div>
      );
    }

    return (
      <div className="get-quote-container">
        <img
          src="https://pbs.twimg.com/profile_images/3280677683/0ca071f08032e65c1b268b1cf56466ef_400x400.jpeg"
          alt=""
        />
        <div className="get-quote-sub-container">
          <div className="size-selection-container">
            <h4>Select the size of wisdom you seek</h4>
            <select
              name=""
              onChange={e => {
                this.handleSize(e);
              }}
            >
              <option value="">Choose Here</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <button onClick={this.handleGetWisdom}>
              Today's your lucky day, as I am now going to share with you my
              wisdom.
            </button>
          </div>
          <hr className="divider" />
          {wisdom}
        </div>
      </div>
    );
  }
}
