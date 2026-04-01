import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  addCommunityMember,
  createCommunity,
  createCommunityQuestion,
  getCommunities,
  getCommunityMembers,
  getCommunityQuestions,
} from '../../api/communitiesApi';
import { usersData } from '../../api/usersApi';
import Spinner from '../../components/molecules/Spinner/Spinner.component';

import './CommunityPage.styles.scss';

const CommunityPage = ({ auth: { isAuthenticated, user } }) => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  const [members, setMembers] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [communityForm, setCommunityForm] = useState({ name: '', description: '' });
  const [memberForm, setMemberForm] = useState({ userId: '' });
  const [questionForm, setQuestionForm] = useState({ title: '', body: '' });
  const [showCreateCommunityForm, setShowCreateCommunityForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const selectedCommunity = useMemo(
    () => communities.find((item) => String(item.id) === String(selectedCommunityId)) || null,
    [communities, selectedCommunityId],
  );

  const loadBaseData = async () => {
    if (!isAuthenticated) {
      setCommunities([]);
      setUsers([]);
      setSelectedCommunityId('');
      setMembers([]);
      setQuestions([]);
      setErrorMessage('');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [communitiesRes, usersRes] = await Promise.all([getCommunities(), usersData()]);
      const communitiesData = communitiesRes.data?.data || [];

      setCommunities(communitiesData);
      setUsers(usersRes.data?.data || []);

      if (communitiesData.length > 0 && !selectedCommunityId) {
        setSelectedCommunityId(communitiesData[0].id);
      }

      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to load communities');
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityDetails = async (communityId) => {
    if (!communityId) {
      setMembers([]);
      setQuestions([]);
      return;
    }

    try {
      const [membersRes, questionsRes] = await Promise.all([
        getCommunityMembers(communityId),
        getCommunityQuestions(communityId),
      ]);

      const questionItems = questionsRes.data?.data || [];


      setMembers(membersRes.data?.data || []);
      setQuestions(questionItems);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to load community details');
    }
  };


  useEffect(() => {
    loadBaseData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedCommunityId) {
      loadCommunityDetails(selectedCommunityId);
    }
  }, [selectedCommunityId]);

  const handleCreateCommunity = async (event) => {
    event.preventDefault();
    try {
      setActionLoading(true);
      await createCommunity(communityForm);
      setCommunityForm({ name: '', description: '' });
      setSuccessMessage('Community created successfully');
      setShowCreateCommunityForm(false);
      await loadBaseData();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create community');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    if (!selectedCommunityId || !memberForm.userId) return;
    try {
      setActionLoading(true);
      await addCommunityMember(selectedCommunityId, { userId: memberForm.userId });
      setMemberForm({ userId: '' });
      setShowAddUserForm(false);
      setSuccessMessage('Member updated successfully');
      await loadCommunityDetails(selectedCommunityId);
      await loadBaseData();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to add user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAskQuestion = async (event) => {
    event.preventDefault();
    if (!selectedCommunityId) return;
    try {
      setActionLoading(true);
      await createCommunityQuestion(selectedCommunityId, questionForm);
      setQuestionForm({ title: '', body: '' });
      setSuccessMessage('Community question posted');
      await loadCommunityDetails(selectedCommunityId);
      await loadBaseData();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to post question');
    } finally {
      setActionLoading(false);
    }
  };


  const clearMessages = () => {
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  if (loading) {
    return <Spinner type='page' width='75px' height='200px' />;
  }

  return (
    <div id='mainbar' className='community-page' onClick={clearMessages}>
      <header className='community-header'>
        <div className='header-text'>
          <h1 className='headline'>Communities</h1>
          <p className='community-subtitle'>
            Create private circles, collaborate with targeted members, and share knowledge within your private community.
          </p>
        </div>
        {!showCreateCommunityForm && (
          <div className='community-header-actions'>
            <button
              type='button'
              className='community-toggle-btn'
              onClick={() => setShowCreateCommunityForm(true)}
              disabled={!isAuthenticated || actionLoading}
            >
              + Create Community
            </button>
          </div>
        )}
      </header>

      {errorMessage && <div className='community-message error'>{errorMessage}</div>}
      {successMessage && <div className='community-message success'>{successMessage}</div>}

      <main className='community-main-grid'>
        <aside className='community-sidebar'>
          {showCreateCommunityForm && (
            <section className='community-card'>
              <div className='card-top'>
                <h2>New Community</h2>
                <button
                  type='button'
                  className='s-btn s-btn__filled s-btn__xs'
                  onClick={() => setShowCreateCommunityForm(false)}
                >
                  Cancel
                </button>
              </div>
              <p className='card-subtitle'>Set a name and clear description for your new circle.</p>
              <form onSubmit={handleCreateCommunity}>
                <input
                  className='s-input'
                  placeholder='Community name'
                  value={communityForm.name}
                  onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })}
                  required
                  maxLength={120}
                  disabled={!isAuthenticated || actionLoading}
                />
                <textarea
                  className='s-textarea'
                  placeholder='What is this community about?'
                  value={communityForm.description}
                  onChange={(e) => setCommunityForm({ ...communityForm, description: e.target.value })}
                  rows={3}
                  required
                  disabled={!isAuthenticated || actionLoading}
                />
                <button type='submit' className='s-btn s-btn__primary' disabled={!isAuthenticated || actionLoading}>
                  Create Circle
                </button>
              </form>
            </section>
          )}

          <section className='community-card'>
            <h2 style={{
              color: "white",
              marginBottom: "10px"
            }}>Your Communities</h2>
            <p className='card-subtitle'>Select a community to view its activity feed.</p>
            <div className='community-list-container'>
              {communities.length === 0 ? (
                <p className='card-subtitle'>No communities found yet.</p>
              ) : (
                communities.map((community) => (
                  <button
                    key={community.id}
                    className={`community-item ${String(selectedCommunityId) === String(community.id) ? 'active' : ''}`}
                    onClick={() => setSelectedCommunityId(community.id)}
                  >
                    <h3>{community.name}</h3>
                    <p>{community.description}</p>
                    <div className='item-meta'>
                      {community.members_count || 0} Memb • {community.questions_count || 0} Ques
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </aside>

        <article className='community-content-feed'>
          {selectedCommunity ? (
            <>
              <section className='community-card'>
                <div className='card-top'>
                  <h2>{selectedCommunity.name} Members</h2>
                  <button
                    type='button'
                    className='s-btn s-btn__filled s-btn__xs'
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                    disabled={!isAuthenticated || actionLoading}
                  >
                    {showAddUserForm ? 'Cancel' : '+ Add User'}
                  </button>
                </div>

                {showAddUserForm && (
                  <form onSubmit={handleAddMember} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #2f2f45' }}>
                    <select
                      className='s-select'
                      value={memberForm.userId}
                      onChange={(e) => setMemberForm({ userId: e.target.value })}
                      required
                      disabled={!isAuthenticated || actionLoading}
                    >
                      <option value=''>Select user to invite</option>
                      {users.map((item) => (
                        <option key={item.id} value={item.id}>{item.username}</option>
                      ))}
                    </select>
                    <button type='submit' className='s-btn s-btn__primary' disabled={!isAuthenticated || actionLoading}>
                      Invite Member
                    </button>
                  </form>
                )}

                <div className='member-list-grid'>
                  {members.length === 0 ? (
                    <p className='card-subtitle'>This community hasn't added any members yet.</p>
                  ) : (
                    members.map((member) => (
                      <div className='member-item' key={member.id}>
                        <img src={member.user?.gravatar} alt={member.user?.username || 'member'} />
                        <div className='member-info'>
                          <strong>{member.user?.username || 'User'}</strong>
                          <span>{moment(member.created_at).fromNow()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className='community-card'>
                <div className='card-top' style={{ marginBottom: '24px' }}>
                  <h2>Ask a Question</h2>
                </div>
                <form onSubmit={handleAskQuestion}>
                  <input
                    className='s-input'
                    placeholder='Question title'
                    value={questionForm.title}
                    onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                    maxLength={250}
                    required
                    disabled={!isAuthenticated || actionLoading}
                  />
                  <textarea
                    className='s-textarea'
                    placeholder='Describe your question in detail...'
                    value={questionForm.body}
                    onChange={(e) => setQuestionForm({ ...questionForm, body: e.target.value })}
                    rows={4}
                    required
                    disabled={!isAuthenticated || actionLoading}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type='submit' className='s-btn s-btn__primary' disabled={!isAuthenticated || actionLoading}>
                      Post to Community
                    </button>
                  </div>
                </form>

                <div className='question-feed' style={{ marginTop: '40px' }}>
                  <div className='feed-section-header'>
                    <h3>Activity Feed</h3>
                  </div>
                  {questions.length === 0 ? (
                    <p className='card-subtitle'>No activity in this community yet. Be the first to ask!</p>
                  ) : (
                    questions.map((question) => (
                      <div className='question-item' key={question.id}>
                        <Link to={`/communities/${selectedCommunityId}/questions/${question.id}`}>
                          <h4>{question.title}</h4>
                        </Link>
                        <div className='question-body' style={{ maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {question.body}
                        </div>
                        <span className='question-meta'>
                          Asked by <strong>{question.user?.username || 'User'}</strong> • {moment(question.created_at).fromNow()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          ) : (
            <section className='community-card'>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h2 style={{ color: '#c4c8cc' }}>Select a Community</h2>
                <p className='card-subtitle'>Choose a circle from the sidebar to view discussions and members.</p>
              </div>
            </section>
          )}
        </article>
      </main>

      {isAuthenticated && user && (
        <footer className='community-footnote'>
          Browsing as <strong>{user.username}</strong>
        </footer>
      )}
    </div>
  );
};

CommunityPage.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CommunityPage);
