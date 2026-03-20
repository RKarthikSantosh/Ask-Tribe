const axios = require('axios');
const bcrypt = require('bcryptjs');

const constantsHolder = require('../constants');
const { UsersModel, AnswersModel } = require('../models');

const DEFAULT_AI_USERNAME = 'asktribe_ai_assistant';
const DEFAULT_AI_PASSWORD = 'ai-assistant-not-for-login';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
const DEFAULT_OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';
const DEFAULT_GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

const STACK_OVERFLOW_STYLE_SYSTEM_PROMPT = [
  'You are a senior Stack Overflow style assistant for software questions.',
  'Always answer briefly and directly.',
  'Use this exact structure in markdown:',
  '1) **Short answer**: one or two lines.',
  '2) **Why**: one short reason tied to the question context.',
  '3) **Fix**: up to 3 concise steps.',
  'No long introductions. No unnecessary explanation.',
].join('\n');

const stripHtml = (value = '') => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const buildPrompt = ({ title, body, tagName }) => {
  const cleanedBody = stripHtml(body).slice(0, 2500);

  return [
    'Give a concise and practical answer for this question.',
    '',
    `Question title: ${title}`,
    `Question body: ${cleanedBody}`,
    `Tags: ${tagName || 'N/A'}`,
  ].join('\n');
};

const createFallbackAnswer = ({ title, body }) => {
  const compactTitle = (title || '').trim();
  const compactBody = stripHtml(body).slice(0, 280);
  const normalized = `${compactTitle} ${compactBody}`.toLowerCase();

  if (normalized.includes('ram mandir') || normalized.includes('ayodhya')) {
    return [
      '**Short answer**: Ram Mandir (Ram Janmabhoomi Temple) is in Ayodhya, Uttar Pradesh, India.',
      '',
      '**Why**: Your question asks for the location directly.',
      '',
      '**Fix**:',
      '1. Search for "Ram Janmabhoomi Ayodhya" on maps.',
      '2. Check official temple timings before traveling.',
      '3. Verify route and local guidance on visit day.',
    ].join('\n');
  }

  return [
    `**Short answer**: Start with a direct fix for "${compactTitle || 'this question'}" using your post details.`,
    '',
    `**Why**: The body says: ${compactBody || 'question details'}. A minimal, context-specific correction is fastest.`,
    '',
    '**Fix**:',
    '1. Reproduce the issue with a minimal example from title/body.',
    '2. Apply one targeted change and retest immediately.',
    '3. Share code/error output if you need a precise next step.',
  ].join('\n');
};

const resolveModelConfig = () => {
  if (process.env.GROQ_API_KEY) {
    return {
      provider: 'groq',
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
      endpoint: process.env.GROQ_API_URL || DEFAULT_GROQ_ENDPOINT,
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      endpoint: process.env.OPENAI_API_URL || DEFAULT_OPENAI_ENDPOINT,
    };
  }

  return null;
};

const getAssistantUser = async () => {
  const username = process.env.AI_ASSISTANT_USERNAME || DEFAULT_AI_USERNAME;

  let assistant = await UsersModel.findOne({ where: { username } });
  if (assistant) {
    return assistant;
  }

  const hashedPassword = await bcrypt.hash(
    process.env.AI_ASSISTANT_PASSWORD || DEFAULT_AI_PASSWORD,
    10,
  );

  try {
    assistant = await UsersModel.create({
      username,
      password: hashedPassword,
      gravatar: constantsHolder.GRAVATAR_URL(999999),
    });
  } catch (error) {
    assistant = await UsersModel.findOne({ where: { username } });
  }

  return assistant;
};

const generateAnswer = async ({ title, body, tagName }) => {
  const modelConfig = resolveModelConfig();
  if (!modelConfig) {
    return createFallbackAnswer({ title, body });
  }

  try {
    const payload = {
      model: modelConfig.model,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: STACK_OVERFLOW_STYLE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: buildPrompt({ title, body, tagName }),
        },
      ],
    };

    if (modelConfig.provider === 'groq') {
      payload.max_completion_tokens = 700;
      payload.top_p = 1;
      payload.reasoning_effort = 'medium';
      payload.stream = false;
    } else {
      payload.max_tokens = 500;
    }

    const response = await axios.post(modelConfig.endpoint, payload, {
      headers: {
        Authorization: `Bearer ${modelConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 25000,
    });

    return response?.data?.choices?.[0]?.message?.content?.trim()
      || createFallbackAnswer({ title, body });
  } catch (error) {
    console.log('AI answer generation failed:', error?.response?.data || error.message);
    return createFallbackAnswer({ title, body });
  }
};

exports.createAssistantAnswer = async ({ postId, title, body, tagName }) => {
  try {
    const content = await generateAnswer({ title, body, tagName });
    if (!content) {
      return null;
    }

    const assistant = await getAssistantUser();
    if (!assistant) {
      return null;
    }

    return await AnswersModel.create({
      body: content,
      user_id: assistant.id,
      post_id: postId,
    });
  } catch (error) {
    console.log('AI answer save failed:', error.message);
    return null;
  }
};
