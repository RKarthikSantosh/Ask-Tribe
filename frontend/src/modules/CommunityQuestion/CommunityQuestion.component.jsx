import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  getCommunityQuestion,
  getCommunityQuestionAnswers,
  getCommunityQuestionComments,
  createCommunityQuestionAnswer,
  createCommunityQuestionComment,
} from '../../api/communitiesApi';
import Spinner from '../../components/molecules/Spinner/Spinner.component';

import './CommunityQuestion.styles.scss';

const CommunityQuestion = ({ auth: { isAuthenticated, user } }) => {
  const { communityId, questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [answerDraft, setAnswerDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [qRes, aRes, cRes] = await Promise.all([
        getCommunityQuestion(questionId),
        getCommunityQuestionAnswers(questionId),
        getCommunityQuestionComments(questionId),
      ]);

      setQuestion(qRes.data?.data || null);
      setAnswers(aRes.data?.data || []);
      setComments(cRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load question details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [questionId]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!answerDraft.trim()) return;

    try {
      setActionLoading(true);
      await createCommunityQuestionAnswer(questionId, { body: answerDraft });
      setAnswerDraft('');
      setSuccess('Answer posted successfully');
      const res = await getCommunityQuestionAnswers(questionId);
      setAnswers(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentDraft.trim()) return;

    try {
      setActionLoading(true);
      await createCommunityQuestionComment(questionId, { body: commentDraft });
      setCommentDraft('');
      setSuccess('Comment posted successfully');
      const res = await getCommunityQuestionComments(questionId);
      setComments(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner type='page' width='75px' height='200px' />;
  if (!question) return <div className='community-question-page'><div className='community-message error'>Question not found</div></div>;

  return (
    <div className='community-question-page' onClick={() => { setError(''); setSuccess(''); }}>
        <Link to="/communities" className="back-link">
          ← Back to Communities
        </Link>

      <header className='question-header'>
        <h1>{question.title}</h1>
      </header>

      <div className='question-meta'>
        <div className='meta-item'>Asked <strong>{moment(question.created_at).fromNow()}</strong></div>
        <div className='meta-item'>By <strong>{question.user?.username || 'User'}</strong></div>
      </div>

      {error && <div className='community-message error'>{error}</div>}
      {success && <div className='community-message success'>{success}</div>}

      <main className='question-main-content'>
        <div className='question-feed-left'>
          <article className='question-article'>
            <div className='question-body'>{question.body}</div>
            <div className='question-author'>
              <div className='author-card'>
                <img src={question.user?.gravatar} alt="Author" />
                <div className='author-info'>
                  <span>Asked {moment(question.created_at).format('MMM D, YYYY')}</span>
                  <strong>{question.user?.username}</strong>
                </div>
              </div>
            </div>
          </article>

          <section className='answers-section'>
            <h2 className='section-title'>{answers.length} Answers</h2>
            <div className='answer-list'>
              {answers.map((answer) => (
                <div key={answer.id} className='answer-item'>
                  <div className='answer-body'>{answer.body}</div>
                  <div className='answer-footer'>
                     <span>Answered {moment(answer.created_at).fromNow()}</span>
                     <span>By <strong className='user-link'>{answer.user?.username}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {isAuthenticated && (
            <section className='new-answer-form'>
              <h3>Your Answer</h3>
              <form onSubmit={handlePostAnswer}>
                <textarea
                  className='s-textarea'
                  placeholder='Write your answer here...'
                  value={answerDraft}
                  onChange={(e) => setAnswerDraft(e.target.value)}
                  disabled={actionLoading}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type='submit' className='s-btn s-btn__primary' disabled={actionLoading}>
                    Post Answer
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>

        <aside className='comments-sidebar'>
          <div className='comments-card'>
            <h3>Comments ({comments.length})</h3>
            <div className='comment-list'>
              {comments.map((comment) => (
                <div key={comment.id} className='comment-item'>
                  <p>{comment.body}</p>
                  <div className='comment-meta'>
                    — <strong>{comment.user?.username}</strong> {moment(comment.created_at).fromNow()}
                  </div>
                </div>
              ))}
            </div>

            {isAuthenticated && (
              <form className='new-comment-form' onSubmit={handlePostComment}>
                <textarea
                  className='s-textarea'
                  placeholder='Add a comment...'
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  disabled={actionLoading}
                />
                <button type='submit' className='s-btn s-btn__filled s-btn__xs' disabled={actionLoading}>
                  Add Comment
                </button>
              </form>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

CommunityQuestion.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CommunityQuestion);
