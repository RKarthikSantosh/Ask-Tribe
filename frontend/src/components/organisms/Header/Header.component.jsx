import {Link, useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../../redux/auth/auth.actions';

import Logo from '../../../assets/LogoMd.svg';
import SmallLogo from '../../../assets/LogoGlyphMd.svg';
import Spinner from '../../molecules/Spinner/Spinner.component';
import LinkButton from '../../molecules/LinkButton/LinkButton.component';
import MobileSideBar from '../../organisms/MobileSideBar/MobileSideBar.component';

import './Header.styles.scss';

const Header = ({auth: {isAuthenticated, loading, user}, logout}) => {
  let history = useHistory();

  const authLinks = (
    <div className='btns'>
      {loading || !user ? (
        <Spinner width='50px' height='50px' />
      ) : (
        <Link to={`/users/${user.id}`} title={user.username}>
          <img
            alt='user-logo'
            className='logo'
            src={user.gravatar}
          />
        </Link>
      )}
      <LinkButton
        text={'Log out'}
        link={'/login'}
        type={'s-btn__filled'}
        handleClick={logout}
      />
    </div>
  );


  const guestLinks = (
    <div className='btns'>
      <LinkButton text={'Log in'} link={'/login'} type={'s-btn__primary'} />
      <LinkButton text={'Sign up'} link={'/register'} type={'s-btn__filled'} />
    </div>
  );


  return loading ? (
    ''
  ) : (
    <>
      <nav className='navbar fixed-top navbar-expand-lg navbar-light bs-md'>
        <div className="hamburger">
          <MobileSideBar hasOverlay />
        </div>
        <div className='header-brand-div'>
          <Link className='navbar-brand' to='/'>
            <Logo className='full-logo' />
            <SmallLogo className='glyph-logo' />
          </Link>
        </div>
        
          <form
            id='search'
            onSubmit={() => history.push('/questions')}
            className={`grid--cell fl-grow1 searchbar px12 js-searchbar`}
            autoComplete='off'
          >
            <div className='ps-relative search-frame' style={{
              marginBottom: "10px",
              scale: ".9",
            }}>
              <input
                className='s-input s-input__search h100 search-box'
                autoComplete='off'
                type='text'
                name='search'
                maxLength='35'
                placeholder='Search...'
              />
            </div>
          </form>
          <div className="header-search-div">
          {!loading && (
            <>{isAuthenticated ? authLinks : guestLinks}</>
          )}
        </div>
      </nav>
    </>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {logout})(Header);
