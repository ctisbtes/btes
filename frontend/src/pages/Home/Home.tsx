import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactTypingEffect from 'react-typing-effect';

import './Home.scss';
import background from './mainPageBackground.jpg';
import { authenticationService } from '../../services/authenticationService';
import { RootState } from '../../state/RootState';
import { hasValue } from '../../common/utils/hasValue';

const Home: React.FC = () => {
  const currentUser = useSelector(
    (state: RootState) => state.currentUser ?? null
  );
  const logout = async () => {
    await authenticationService.logout();
  };

  return (
    <div className="page-home d-flex justify-content-center col-12">
      <img
        className="global-bg-img page-home--bg-img"
        src={background}
        alt="background"
      />
      <div className="row d-flex justify-content-center">
        <div className="page-home--header d-flex justify-content-center align-items-center mt-3 col-12 text-center">
          <span>
            <b>Blockchain Technology For Everyone</b>
          </span>
        </div>
        <div className="page-home--header-info d-flex justify-content-center col-lg-8 col-12 text-center">
          <span>
            <p>
              What is{' '}
              <ReactTypingEffect
                text={[
                  'blockchain?',
                  'Bitcoin?',
                  'P2P?',
                  'Ethereum?',
                  'block?',
                  'transaction?',
                  'key pair?',
                  'public ledger?',
                  'wallet?',
                  'mining?',
                  'consensus?',
                ]}
                // speed={2}  not actually working, it just works for only passing the new words, not typing..
                // Alternative: Learn/Comprehend concept of blockchain, bitcoin, P2P etc..
              />
            </p>
          </span>
        </div>

        <div className="buttons col-12 d-flex align-content-center justify-content-center align-items-center">
          <Link to="/sandbox" className="btn btn-info m-2 col-lg-2 col-4">
            SANDBOX
          </Link>
          <Link to="/lessons" className="btn btn-success m-2 col-lg-2 col-4">
            START LEARNING
          </Link>
          <Link to="/explorer" className="btn btn-primary m-2 col-lg-2 col-4">
            EXPLORER
          </Link>
          {hasValue(currentUser.username) ? (
            <button
              onClick={logout}
              className="btn btn-danger m-2 col-lg-2 col-4"
            >
              LOGOUT
            </button>
          ) : (
            <Link to="/signin" className="btn btn-danger m-2 col-lg-2 col-4">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
