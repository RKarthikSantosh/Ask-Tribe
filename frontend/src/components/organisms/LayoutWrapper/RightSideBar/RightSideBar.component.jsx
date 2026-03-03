import TagsWidget from './TagsWidget/TagsWidget.component';

import './RightSideBar.styles.scss';

const RightSideBar = () => {
  return (
    <>
      <div id='sidebar' className='side-bar'>
        <TagsWidget />
      </div>
    </>
  );
};

export default RightSideBar;
