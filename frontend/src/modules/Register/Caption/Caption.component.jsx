
import {Link} from 'react-router-dom';

import QuoteLogo from '../../../assets/Quote.svg';
import VoteLogo from '../../../assets/Vote.svg';
import TagsLogo from '../../../assets/Tags.svg';
import TrophyLogo from '../../../assets/Trophy.svg';

import './Caption.styles.scss';

const Caption = () => {
  return (
    <>
      <div className='caption fc-black-600'>
        <h3>Join the AskTribe community</h3>
        <div className='caption-item'>
          <div className='grid-icon'>
            <QuoteLogo/>
          </div>
          <div className='grid-cell'>Get unstuck — ask a question</div>
        </div>
        <div className='caption-item'>
          <div className='grid-icon'>
            <VoteLogo/>
          </div>
          <div className='grid--cell'>
            Unlock new privileges like voting and commenting
          </div>
        </div>
        <div className='caption-item'>
          <div className='grid-icon'>
            <TagsLogo/>
          </div>
          <div className='grid-cell'>
            Save your favorite tags and filters
          </div>
        </div>
        <div className='caption-item'>
          <div className='grid-icon'>
            <TrophyLogo/>
          </div>
          <div className='grid-cell'>Earn reputation and badges</div>
        </div>
        <div className='caption-item fc-black-600'>
          <div>
            Use the power of AskTribe inside your organization.
            <br />
            Try{' '}
            <Link to='https://asktribe.com/teams'>
              AskTribe for Teams — free trial
            </Link>
            .
          </div>
        </div>
      </div>
    </>
  );
};

export default Caption;
