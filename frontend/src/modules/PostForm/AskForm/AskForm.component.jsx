import { useState, useEffect, useRef } from "react";
import {useHistory} from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addPost } from "../../../redux/posts/posts.actions";
import MarkdownEditor from "../../../components/organisms/MarkdownEditor/MarkdownEditor.component";
import { badWordsFilter } from "../../../utils/censorBadWords";

import "./AskForm.styles.scss";

const AskForm = ({ addPost }) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tagname: "",
    askAi: false,
    aiAssistant: "ramineni_ai",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFormErrors({});
  }, [formData]);

  const markdownEditorRef = useRef(null);

  const { title, body, tagname, askAi, aiAssistant } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onToggleAskAi = () =>
    setFormData((prev) => ({ ...prev, askAi: !prev.askAi }));
  const history = useHistory();

  const validateFormData = () => {
    const errors = [];

    const tags = formData.tagname
      .split(",")
      .filter(Boolean)
      .map((tag) => tag.trim());

    tags.forEach((tag) => {
      if (tag.length > 25) {
        errors.push({
          tagname: `A tag name can't be longer than 25 characters.`,
        });
      } else if (/[^a-zA-Z]/.test(tag)) {
        errors.push({
          tagname: `${tag} tag must contain English alphabets only (no spaces).`,
        });
      }
    });

    if (badWordsFilter.isProfane(formData.tagname)) {
      errors.push({ tagname: "Inappropriate words are not allowed." });
    }

    errors
      .reverse()
      .forEach((err) => setFormErrors((prev) => ({ ...prev, ...err })));

    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const errors = validateFormData();

    // if there are errors, don't submit
    if (errors.length > 0) return;

    addPost({ title, body, tagname, askAi, aiAssistant });

    setFormData({
      title: "",
      body: "",
      tagname: "",
      askAi: false,
      aiAssistant: "ramineni_ai",
    });
    history.push("/");
  };

  const updateConvertedContent = (htmlConvertedContent) => {
    setFormData({ ...formData, body: htmlConvertedContent });
  };

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="question-form p16 s-card">
          <div className="question-layout">
            <div className="title-grid">
              <label className="form-label s-label">
                Title
                <p className="title-desc fw-normal fs-caption">
                  Be specific and imagine you’re asking a question to another
                  person
                </p>
              </label>
              <input
                className="title-input s-input"
                type="text"
                name="title"
                value={title}
                onChange={(e) => onChange(e)}
                id="title"
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                required
              />
            </div>
            <div className="body-grid">
              <label className="form-label s-label fc-black-800">
                Body
                <p className="body-desc fw-normal fs-caption fc-black-800">
                  Include all the information someone would need to answer your
                  question
                </p>
              </label>
              <div className="s-textarea rich-text-editor-container">
                <MarkdownEditor
                  ref={markdownEditorRef}
                  onChange={updateConvertedContent}
                />
              </div>
            </div>
            <div className="tag-grid">
              <label className="form-label s-label">
                Tag Name
                <p className="tag-desc fw-normal fs-caption">
                  Add up to 5 tags to describe what your question is about
                </p>
              </label>
              <input
                className="tag-input s-input"
                type="text"
                name="tagname"
                value={tagname}
                onChange={(e) => onChange(e)}
                id="tagname"
                placeholder="e.g. (ajax, django, string)"
                required
              />
              <p className="fc-error fw-bold ml8 mt4">{formErrors.tagname}</p>
            </div>
            <div className="ask-ai-grid">
              <div className="ask-ai-header">
                <div className="ask-ai-label-wrap">
                  <div className="ask-ai-label">Ask AI</div>
                  <span className="ask-ai-badge">Auto answer</span>
                </div>
                <span className={`ask-ai-state ${askAi ? "on" : "off"}`}>
                  {askAi ? "Enabled" : "Disabled"}
                </span>
              </div>
              <button
                type="button"
                className={`ask-ai-toggle ${askAi ? "enabled" : "disabled"}`}
                onClick={onToggleAskAi}
                aria-pressed={askAi}
                aria-label="Toggle Ask AI auto answer"
              >
                <span className="ask-ai-track">
                  <span className="ask-ai-knob" />
                </span>
                <span className="ask-ai-toggle-text">
                  {askAi ? "Ask AI is ON" : "Ask AI is OFF"}
                </span>
              </button>
              <p className="ask-ai-desc">
                {askAi
                  ? "AI will generate an answer from your question title and body."
                  : "Enable this to get an automatic AI answer after posting."}
              </p>
              <div className="ask-ai-assistant-picker">
                <label htmlFor="aiAssistant" className="ask-ai-picker-label">
                  Choose AI assistant
                </label>
                <select
                  id="aiAssistant"
                  name="aiAssistant"
                  className="ask-ai-picker-select"
                  value={aiAssistant}
                  onChange={(e) => onChange(e)}
                  disabled={!askAi}
                >
                  <option value="ramineni_ai">ramineni_ai</option>
                  <option value="eswar_ai">eswar_ai</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="post-button mt32">
          <button
            className="s-btn s-btn__primary"
            id="submit-button"
            name="submit-button"
          >
            Post your question
          </button>
        </div>
      </form>
    </>
  );
};

AskForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(AskForm);
