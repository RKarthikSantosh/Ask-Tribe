import React, { Fragment } from "react";

import GitHub from "../../../assets/GitHub.svg";

import './Footer.styles.scss';

const Footer = () => {
  return <>
    <div className='footer'>
      <div className="socials">
        <div className="social-item">
          <a
            href='https://github.com/eswar-7116/qna-portal'
            target='_blank'
            rel="noreferrer"
          >
            <GitHub/>
          </a>
          <p><strong>GitHub</strong></p>
        </div>
      </div>
    </div>
  </>
};

export default Footer;