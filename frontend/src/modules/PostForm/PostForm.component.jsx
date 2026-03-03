import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../../components/molecules/Spinner/Spinner.component';
import AskForm from './AskForm/AskForm.component';
import Footer from "../../components/organisms/Footer/Footer.component";

import './PostForm.styles.scss';

const PostForm = ({auth: {isAuthenticated, loading}}) => {
  if (!isAuthenticated) {
    return <Redirect to='/login' />;
  }

  return loading === null ? (
    <Spinner type='page' width='75px' height='200px' />
  ) : (
    <>
      <div className='post-form-container'>
        <div className='post-form-content'>
          <div className='post-form-header'>
            <div className='post-form-headline fc-black-800'>
              Ask a public question
            </div>
          </div>
          <div className='post-form-section'>
            <div className='postform' style={{width: '100%'}}>
              <AskForm />
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

PostForm.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(PostForm);
