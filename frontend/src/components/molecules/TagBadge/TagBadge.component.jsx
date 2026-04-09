
import {Link} from 'react-router-dom';

import './TagBadge.styles.scss';

const TagBadge = ({tag_name, size, display, link, href}) => {
  return (
    <>
      <div className='tags-badge' style={{ display }}>
          <Link className={`${size}`} to={link ? link : `/tags/${tag_name}`}>
            {tag_name}
          </Link>
        </div>
    </>
  );
};

export default TagBadge;
