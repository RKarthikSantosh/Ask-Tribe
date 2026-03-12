import { useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getPosts} from '../../redux/posts/posts.actions';
import LinkButton from '../../components/molecules/LinkButton/LinkButton.component';
import PostItem from '../../components/molecules/PostItem/PostItem.component';
import Spinner from '../../components/molecules/Spinner/Spinner.component';
import SearchBox from '../../components/molecules/SearchBox/SearchBox.component';
import handleSorting from "../../utils/handleSorting";
import Pagination from "../../components/organisms/Pagination/Pagination.component";
import ButtonGroup from '../../components/molecules/ButtonGroup/ButtonGroup.component';
import handleFilter from '../../utils/handleFilter'

import './HomePage.styles.scss';

const itemsPerPage = 10;

const HomePage = ({getPosts, post: {posts, loading}}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePaginationChange = (e, value) => setPage(value);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const filteredPosts = [...(posts || [])]
    .sort(handleSorting(sortType))
    .filter(handleFilter(sortType))
    .filter((post) =>
      searchQuery === '' ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return loading || !posts ? (
    <Spinner type='page' width='75px' height='200px' />
  ) : (
    <>
      <div id='mainbar' className='homepage fc-black-800'>
        <div className='questions-grid'>
          <h3 className='questions-headline'>Top Questions</h3>
          <div className='questions-btn'>
            <LinkButton
              text={'Ask Question'}
              link={'/add/question'}
              type={'s-btn__primary'}
            />
          </div>
        </div>
        <div className='questions-tabs'>
          <SearchBox
            placeholder={'Search questions...'}
            handleChange={handleSearchChange}
            width={'220px'}
          />
          <div className="right-side-tools">
            <span className="item-count">
              {new Intl.NumberFormat('en-IN').format(filteredPosts.length)} questions
            </span>
            <ButtonGroup
              buttons={['Newest', 'Today', 'Week', 'Month', 'Year']}
              selected={sortType}
              setSelected={setSortType}
            />
          </div>
        </div>
        <div className="questions">
          <div className="postQues">
            {filteredPosts.length === 0 ? (
              <p style={{padding: '24px 16px', color: '#9199a1'}}>No questions match your search.</p>
            ) : (
              filteredPosts
                .slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)
                .map((post, index) => (
                  <PostItem key={index} post={post} />
                ))
            )}
          </div>
        </div>
        <Pagination
          page={page}
          itemList={filteredPosts}
          itemsPerPage={itemsPerPage}
          handlePaginationChange={handlePaginationChange}
        />
      </div>
    </>
  );
};

HomePage.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(HomePage);
