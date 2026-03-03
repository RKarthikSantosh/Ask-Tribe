import {useEffect} from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { getProfile } from '../../redux/users/users.actions';
import { getUserPosts } from '../../redux/posts/posts.actions';

import UserSection from "./UserSection/UserSection.component";
import PostItem from '../../components/molecules/PostItem/PostItem.component';
import Spinner from '../../components/molecules/Spinner/Spinner.component';

import './ProfilePage.styles.scss';

const ProfilePage = ({getProfile, getUserPosts, user: {user, loading}, post: {posts}}) => {
  const { id } = useParams();

  useEffect(() => {
    getProfile(id);
    getUserPosts(id);
    // eslint-disable-next-line
  }, [getProfile, getUserPosts, id]);

  return loading || user === null ? (
    <Spinner type='page' width='75px' height='200px' />
  ) : (
    <>
      <div id='mainbar' className='user-main-bar pl24 pt24'>
        <div className='user-card'>
          <UserSection user={user}/>
        </div>
        <div className='user-posts mt24' style={{ width: "100%", marginTop: "30px" }}>
          <h2 className='fs-title mb16' style={{ fontSize: "1.5rem" }}>Posts</h2>
          <div className='questions'>
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <PostItem key={index} post={post} />
              ))
            ) : (
              <p>This user has not asked any questions yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

ProfilePage.propTypes = {
  getProfile: PropTypes.func.isRequired,
  getUserPosts: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  post: state.post,
});

export default connect(mapStateToProps, {getProfile, getUserPosts})(ProfilePage);
