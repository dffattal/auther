import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import axios from 'axios'
import { setCurrentUser } from '../redux/login'
import store from '../store'

/* -----------------    COMPONENT     ------------------ */

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  changeEmail(emailQuery) {
    this.setState({email: emailQuery})
  }

  changePassword(passwordQuery) {
    this.setState({password: passwordQuery})
  }

  render() {
    const { message } = this.props;
    return (
      <div className="signin-container">
        <div className="buffer local">
          <form onSubmit={this.onLoginSubmit}>
            <div className="form-group">
              <label>email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                required
                onChange={event => {this.changeEmail(event.target.value)}}
              />
            </div>
            <div className="form-group">
                <label>password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  required
                  onChange={event => {this.changePassword(event.target.value)}}
                />
            </div>
            <button type="submit" className="btn btn-block btn-primary">{message}</button>
          </form>
        </div>
        <div className="or buffer">
          <div className="back-line">
            <span>OR</span>
          </div>
        </div>
        <div className="buffer oauth">
          <p>
            <a
              target="_self"
              href="/auth/google"
              className="btn btn-social btn-google">
              <i className="fa fa-google" />
              <span>{message} with Google</span>
            </a>
          </p>
        </div>
      </div>
    );
  }

  onLoginSubmit(event) {
    const { message } = this.props;
    event.preventDefault();
    store.dispatch(setCurrentUser(this.state))
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = () => ({ message: 'Log in' });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(Login);
