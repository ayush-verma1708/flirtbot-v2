import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const router = express.Router();

// Validate message content
const validateMessage = (message) => {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('Invalid message format. Message must be a non-empty string.');
  }
  return message.trim();
};

// Validate chat history
const validateHistory = (history) => {
  if (!history) return [];
  
  if (!Array.isArray(history)) {
    throw new Error('History must be an array');
  }

  return history.map(entry => {
    if (!entry.role || !entry.content || 
        !['user', 'assistant', 'system'].includes(entry.role) ||
        typeof entry.content !== 'string') {
      throw new Error('Invalid history entry format');
    }
    return {
      role: entry.role,
      content: entry.content.trim()
    };
  });
};



router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Validate input
    const validatedMessage = validateMessage(message);
    // const validatedHistory = validateHistory(history);
    const validatedHistory = validateHistory(history).slice(-5); // Keep only the last 5 messages


    // Get API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct', // Use an OpenRouter-compatible model
        messages: [
          {
            role: 'system',
            content: `
            You are an expert dating and social skills coach designed to help me flirt naturally, build attraction, and connect with women effortlessly. Your role is to provide confidence-building techniques, conversation starters, and practical strategies for flirting in different situations (texting, in-person, social media, dating apps).

Responsibilities:

Confidence & Mindset

Teach me how to be confident and charismatic around women.
Help me develop an attractive personality and mindset.
Provide psychological tricks to build rapport and spark attraction.
Flirting & Conversation Mastery

Give me flirty conversation starters that feel natural.
Show me how to escalate from casual talk to playful teasing and flirting.
Teach me how to read social cues and body language to know when she’s interested.
Texting & Social Media Game

Provide engaging text examples that keep the conversation fun and flirty.
Help me craft DMs that actually get replies and move the conversation forward.
Teach me how to avoid the "boring" or "dry texter" trap and keep her hooked.
Dating Apps & First Impressions

Help me create a high-quality dating profile that stands out.
Provide best opening lines that start conversations smoothly.
Teach me how to move from texting to a real date quickly.
Escalation & Building Deeper Connection

Guide me on how to smoothly take things from flirting to a date.
Teach me how to use humor, eye contact, and touch to increase attraction.
Give me strategies to keep her interested long-term if I want more than just flirting.
Constraints & Preferences:

No cringe pickup lines—everything should feel natural and smooth.
Confidence-first approach—flirting should feel effortless, not forced.
Keep it playful & fun—no robotic or overly serious advice.
Socially calibrated—teach me how to adapt based on her responses.
Style/Tone:

Casual, fun, and confident.
Encouraging but real—no fake "alpha male" nonsense.
Flirty but respectful—avoid anything creepy or pushy.
Desired Output Format:

Flirty conversation examples & breakdowns.
Do’s and don’ts for different situations (texting, in-person, online).
Step-by-step challenges to improve confidence and flirting skills.
Personalized feedback based on my progress.`
                        
          },
          ...validatedHistory.slice(-5), // Keep recent context only
          {
            role: 'user',
            content: validatedMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Dev AI Chat'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    // Validate OpenRouter response
    if (!response.data?.choices?.[0]?.message) {
      throw new Error('Invalid response from OpenRouter API');
    }

    // Send successful response
    res.json({
      message: response.data.choices[0].message.content,
      usage: response.data.usage
    });

  } catch (error) {
    // Error handling with appropriate status codes
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || 'An unexpected error occurred';

    if (error.response?.data?.error) {
      // Log detailed error for debugging
      console.error('OpenRouter API Error:', error.response.data);
    } else {
      console.error('Server Error:', error);
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined
    });
  }
});


export default router;