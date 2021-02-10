import React, { Component } from "react";
import UserMessages from "./components/UserMessages";

class Messages extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <main className="mw-1100">
          <UserMessages />
        </main>
      </React.Fragment>
    );
  }
}

export default Messages;
