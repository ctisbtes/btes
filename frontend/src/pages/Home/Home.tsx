import React from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';
import background from './mainPageBackground.jpg';

const Home: React.FC = () => {
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
            <i>
              BTES is an educational tool for learning Blockchain technology.
              Our platform is designed for everyone including software
              developers, information systems’ designers and students wants to
              learn this technology.
            </i>
          </span>
        </div>

        <div className="buttons col-12 d-flex align-content-center justify-content-center align-items-center">
          <Link to="/lessons" className="btn btn-success m-2 col-lg-2 col-4">
            Start Learning
          </Link>
          <Link to="/explorer" className="btn btn-primary m-2 col-lg-2 col-4">
            Explore
          </Link>
          <Link to="/signin" className="btn btn-danger m-2 col-lg-2 col-4">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
