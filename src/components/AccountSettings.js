import React from "react";
import { Component } from "react";

class AccountSettings extends Component {
  id = localStorage.getItem("id");
  constructor(props) {
    super(props);
    this.state = {
      id: this.id,
      email: "",
      title: props.title,
    };
    fetch("http://localhost:4000/getUser", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: this.state.id }),
    }).then((res) =>
      res.json().then((result) => {
        this.setState({ email: result.email });
      })
    );
  }
  render() {
    return (
      <main>
        <section className="small-container mt-40">
          <form>
            <div className="input-with-label relative">
              <label htmlFor="regestraURL">Your regestra URL</label>
              <input
                className="block pl-180"
                type="text"
                placeholder="emmagrainger"
                value={this.state.title ? this.state.title : ""}
              />
              <span className="fixed-input-txt">https://www.regestra.com/</span>
            </div>
            <div className="input-with-label relative">
              <label htmlFor="email">Your email</label>
              <input
                className="block"
                type="text"
                placeholder="emmagrainger@gmail.com"
                value={this.state.email ? this.state.email : ""}
              />
            </div>
            <div className="mtb-40">
              <p>Receive email notifications</p>
              <div className="input-section">
                <span className="input-container">
                  <input
                    type="radio"
                    name="gran"
                    id="radio-1"
                    defaultValue="checked"
                    readOnly="readOnly"
                  />
                  <label htmlFor="radio-1">
                    <span className="radio">On</span>
                  </label>
                </span>
                <span className="input-container ml-70">
                  <input type="radio" name="gran" id="radio-2" />
                  <label htmlFor="radio-2">
                    <span className="radio">Off</span>
                  </label>
                </span>
              </div>
            </div>
            <div className="flex-row-sb">
              <p>
                Delete your account. This will remove all of your content and
                data associated with it.
              </p>
              <button className="crimson-grad">Delete account</button>
            </div>
            <button className="purple-grad">Save changes</button>
          </form>
        </section>
      </main>
    );
  }
}

export default AccountSettings;
