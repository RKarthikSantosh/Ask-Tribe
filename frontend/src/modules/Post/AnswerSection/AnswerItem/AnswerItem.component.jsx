import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { deleteAnswer, upvoteAnswer, downvoteAnswer } from "../../../../redux/answers/answers.actions";
import moment from "moment";
import { allAnswerRepliesData, createAnswerReply } from "../../../../api/answersApi";

import UpVote from "../../../../assets/ArrowUpLg.svg";
import DownVote from "../../../../assets/ArrowDownLg.svg";
import UserCard from "../../../../components/molecules/UserCard/UserCard.component";

import "./AnswerItem.styles.scss";
import censorBadWords from "../../../../utils/censorBadWords";

const AI_ASSISTANT_USERNAMES = ["ramineni_ai", "eswar_ai"];

const decodeHtmlEntities = (value = "") => {
  if (typeof document === "undefined") {
    return value;
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const parseAiCodeAnswer = (value = "") => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  const codePattern =
    /Language:\s*([^\n]+)\s*\n+Code:\s*\n*```([a-zA-Z0-9#+.-]*)\n([\s\S]*?)```/i;
  const match = normalized.match(codePattern);

  if (match) {
    const language = (match[2] || match[1] || "text").trim().toLowerCase();
    const code = (match[3] || "").replace(/\n+$/, "");

    if (!code) {
      return null;
    }

    return {
      summary: "",
      blocks: [
        {
          title: language.toUpperCase(),
          language,
          code,
        },
      ],
    };
  }

  const htmlCodePattern =
    /Language:\s*([^\n<]+)[\s\S]*?<pre><code(?:\s+class="language-([a-zA-Z0-9#+.-]+)")?[^>]*>([\s\S]*?)<\/code><\/pre>/i;
  const htmlMatch = normalized.match(htmlCodePattern);

  if (htmlMatch) {
    const language = (htmlMatch[2] || htmlMatch[1] || "text").trim().toLowerCase();
    const code = decodeHtmlEntities(htmlMatch[3] || "").replace(/\n+$/, "");

    if (!code) {
      return null;
    }

    return {
      summary: "",
      blocks: [
        {
          title: language.toUpperCase(),
          language,
          code,
        },
      ],
    };
  }

  const fenceRegex = /```([a-zA-Z0-9#+.-]*)\n([\s\S]*?)```/g;
  const blocks = [];
  let fenceMatch;

  while ((fenceMatch = fenceRegex.exec(normalized)) !== null) {
    const language = (fenceMatch[1] || "text").trim().toLowerCase();
    const code = (fenceMatch[2] || "").replace(/\n+$/, "");
    if (!code) {
      continue;
    }

    const before = normalized.slice(0, fenceMatch.index);
    const contextLines = before
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const nearest = contextLines[contextLines.length - 1] || "";
    const title = nearest.replace(/^#+\s*/, "").trim() || language.toUpperCase();

    blocks.push({
      title,
      language,
      code,
    });
  }

  if (!blocks.length) {
    return null;
  }

  const firstFenceIndex = normalized.indexOf("```");
  const introText = firstFenceIndex > -1 ? normalized.slice(0, firstFenceIndex) : "";
  const summary = introText
    .split("\n")
    .map((line) => line.replace(/^#+\s*/, "").trim())
    .filter((line) => line && !line.endsWith(":"))
    .join(" ")
    .trim();

  return { summary, blocks };
};

const copyText = async (text) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const AnswerItem = ({
  deleteAnswer,
  upvoteAnswer,
  downvoteAnswer,
  answer: { body, user_id, gravatar, id, created_at, username, upvotes, downvotes },
  post: { post },
  auth,
}) => {
  const upvotesArr = Array.isArray(upvotes) ? upvotes : [];
  const downvotesArr = Array.isArray(downvotes) ? downvotes : [];
  const voteCount = upvotesArr.length - downvotesArr.length;
  const isAiAnswer = AI_ASSISTANT_USERNAMES.includes(username);
  const aiCodeAnswer = isAiAnswer ? parseAiCodeAnswer(body) : null;
  const aiPlainText = isAiAnswer
    ? String(body || "").replace(/<[^>]+>/g, "").trim()
    : "";
  const [copiedBlock, setCopiedBlock] = useState("");
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [postingReply, setPostingReply] = useState(false);

  const loadReplies = async () => {
    setLoadingReplies(true);

    try {
      const response = await allAnswerRepliesData(id);
      setReplies(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error) {
      setReplies([]);
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    loadReplies();
  }, [id]);

  const handleCopy = async (code, key) => {
    try {
      await copyText(code);
      setCopiedBlock(key);
      setTimeout(() => {
        setCopiedBlock((current) => (current === key ? "" : current));
      }, 1500);
    } catch (error) {
      setCopiedBlock("");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    const trimmed = replyText.trim();
    if (!trimmed) {
      return;
    }

    setPostingReply(true);
    try {
      await createAnswerReply(id, { body: trimmed });
      setReplyText("");
      await loadReplies();
    } catch (error) {
      console.log(error);
    } finally {
      setPostingReply(false);
    }
  };

  return (
    <>
      <div className="answer-layout">
        <div className="vote-cell">
          <div className="vote-container">
            <button
              className="vote-up"
              title="This answer is useful (click again to undo)"
              onClick={() => upvoteAnswer(id)}
            >
              <UpVote className={upvotesArr.includes(auth.user?.id) ? "icon active" : "icon"} />
            </button>
            <div className="vote-count fc-black-500">{voteCount}</div>
            <button
              className="vote-down"
              title="This answer is not useful (click again to undo)"
              onClick={() => downvoteAnswer(id)}
            >
              <DownVote className={downvotesArr.includes(auth.user?.id) ? "icon active" : "icon"} />
            </button>
          </div>
        </div>
        <div className="answer-item">
          {isAiAnswer && <div className="ai-answer-badge">AI Assistant</div>}
          {aiCodeAnswer ? (
            <>
              {aiCodeAnswer.summary ? (
                <div className="ai-code-summary">{censorBadWords(aiCodeAnswer.summary)}</div>
              ) : null}
              <div className="ai-code-notepad" role="region" aria-label="AI code answer">
                <div className="ai-code-header">
                  <span className="ai-code-title">AI Code</span>
                </div>
                {aiCodeAnswer.blocks.map((block, index) => (
                  <div className="ai-code-section" key={`${block.language}-${index}`}>
                    <div className="ai-code-section-header">
                      <span className="ai-code-section-title">{block.title}</span>
                      <div className="ai-code-actions">
                        <span className="ai-code-language">{block.language}</span>
                        <button
                          type="button"
                          className="ai-code-copy-btn"
                          onClick={() => handleCopy(block.code, `${block.language}-${index}`)}
                        >
                          {copiedBlock === `${block.language}-${index}` ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <pre className="ai-code-block">
                      <code>{block.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </>
          ) : isAiAnswer ? (
            <div className="answer-content ai-plain-answer fc-black-800">
              {censorBadWords(aiPlainText)}
            </div>
          ) : (
            <div
              className="answer-content fc-black-800"
              dangerouslySetInnerHTML={{ __html: censorBadWords(body) }}
            ></div>
          )}

          <div className="answer-replies">
            <div className="answer-replies-title">Replies</div>

            {loadingReplies ? (
              <div className="reply-empty">Loading replies...</div>
            ) : replies.length ? (
              <div className="reply-list">
                {replies.map((reply) => {
                  const replyIsAi = AI_ASSISTANT_USERNAMES.includes(reply.username);
                  const aiReplyCode = replyIsAi ? parseAiCodeAnswer(reply.body) : null;
                  return (
                    <div className={`reply-item ${replyIsAi ? "reply-ai" : ""}`} key={reply.id}>
                      <div className="reply-meta">
                        <span className="reply-user">{reply.username}</span>
                        <span className="reply-time">{moment(reply.created_at).fromNow()}</span>
                      </div>
                      {aiReplyCode ? (
                        <div className="reply-ai-rendered">
                          {aiReplyCode.summary ? (
                            <div className="ai-code-summary">{censorBadWords(aiReplyCode.summary)}</div>
                          ) : null}
                          <div className="ai-code-notepad" role="region" aria-label="AI reply code answer">
                            <div className="ai-code-header">
                              <span className="ai-code-title">AI Code</span>
                            </div>
                            {aiReplyCode.blocks.map((block, index) => (
                              <div className="ai-code-section" key={`${reply.id}-${block.language}-${index}`}>
                                <div className="ai-code-section-header">
                                  <span className="ai-code-section-title">{block.title}</span>
                                  <div className="ai-code-actions">
                                    <span className="ai-code-language">{block.language}</span>
                                    <button
                                      type="button"
                                      className="ai-code-copy-btn"
                                      onClick={() => handleCopy(block.code, `${reply.id}-${block.language}-${index}`)}
                                    >
                                      {copiedBlock === `${reply.id}-${block.language}-${index}` ? "Copied" : "Copy"}
                                    </button>
                                  </div>
                                </div>
                                <pre className="ai-code-block">
                                  <code>{block.code}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="reply-body">{censorBadWords(reply.body)}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="reply-empty">No replies yet.</div>
            )}

            {auth?.isAuthenticated ? (
              <form className="reply-form" onSubmit={handleReplySubmit}>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply"
                  className="reply-input"
                  maxLength={600}
                />
                <button
                  type="submit"
                  className="reply-btn"
                  disabled={postingReply || !replyText.trim()}
                >
                  {postingReply ? "Posting..." : "Reply"}
                </button>
              </form>
            ) : (
              <div className="reply-empty">Login to reply.</div>
            )}
          </div>

          <div className="answer-actions">
            <div className="action-btns">
              <div className="answer-menu">
                {!auth.loading &&
                  auth.isAuthenticated &&
                  user_id === auth.user.id && (
                    <Link
                      className="s-link s-link__danger"
                      style={{ paddingLeft: "4px" }}
                      title="Delete the answer"
                      onClick={(e) => deleteAnswer(id)}
                      to={`/questions/${post.id}`}
                    >
                      delete
                    </Link>
                  )}
              </div>
            </div>
            <UserCard
              created_at={created_at}
              user_id={user_id}
              gravatar={gravatar}
              username={username}
              dateType={"answered"}
              backgroundColor={"transparent"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

AnswerItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
  deleteAnswer: PropTypes.func.isRequired,
  upvoteAnswer: PropTypes.func.isRequired,
  downvoteAnswer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  post: state.post,
});

export default connect(mapStateToProps, { deleteAnswer, upvoteAnswer, downvoteAnswer })(AnswerItem);
