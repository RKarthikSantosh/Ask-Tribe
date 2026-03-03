import React from 'react';

import PageSpinner from '../../../assets/PageSpinner.svg';
import ComponentSpinner from '../../../assets/three-dots.svg';

import './Spinner.styles.scss';

const Spinner = ({type, width, height}) => {
  return (
    <div className='spinner' style={{width: `${width}`, height: `${height}`}}>
      {type === 'page' ? <PageSpinner /> : <ComponentSpinner />}
    </div>
  );
};

export default Spinner;
