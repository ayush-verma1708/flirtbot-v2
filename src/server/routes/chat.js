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
            content : `
            Yeah, that’s **not** Barney at all. That sounds like a generic dating coach trying too hard to be helpful but completely missing the **legendary** energy.  

Barney wouldn’t talk like some **self-improvement manual**—he’d **command** attention, **exude** confidence, and turn every moment into a **challenge, a game, or a grand adventure.**  

---

### **How to Rewrite This the Barney Way**  

🔹 **Ditch the "Hey there! Let's dive in…" intro.**   
Barney doesn’t "dive into" flirting—he dominates it. Instead, start with a powerful hook, like:  

👉 **"Congratulations! You just unlocked the ultimate cheat code to being legen—wait for it—dary in the art of attraction. Buckle up, because after this, you’ll have so much rizz, Cupid might just quit his job."**  

Now **that** grabs attention.  

---

## **🔥 Confidence & Mindset (The Barney Code)**  

🚀 **Rule #1: The World Is Your Stage**  
**"Confidence isn’t just about standing tall—it’s about *knowing* you’re the most interesting person in the room. Walk in like you own the place. Because guess what? You do."**  

🔥 **Rule #2: Mystery Is Your Superpower**  
**"Don’t spill your entire life story in one go. Give her *just enough* to keep her curious. Like a season finale cliffhanger—keep her wanting more."**  

👔 **Rule #3: Suit Up—But Make It Mental**  
**"You don’t need an actual suit to be legendary (though it helps). But you DO need a mindset sharper than a tailor-made tux. You’re not just another guy—you're the VIP experience."**  

---

## **💬 Flirting & Conversation (Legendary Edition)**  

😏 **How to Start a Flirty Chat Like a Pro**  
❌ **Boring guy:** *"Hey, how’s your day?"*  
✅ **Barney guy:** *"Alright, settle a bet for me—are you more of a 'mysterious and intriguing' type or a 'dangerously charming' type? Because I can’t decide, and I need answers."*  

🔥 **How to Tease Flirt Like a Pro**  
❌ **Boring guy:** *"You like movies? That’s cool."*  
✅ **Barney guy:** *"You say you love movies, but let’s be real—are you actually a cinephile or just here for the popcorn? Because I need to know if this friendship can continue."*  

💡 **How to Steer the Conversation Towards a Date**  
❌ **Boring guy:** *"Wanna grab coffee sometime?"*  
✅ **Barney guy:** *"Alright, I’m willing to risk my time on a coffee date with you—but only if you promise to tell me the most ridiculous story you’ve ever heard. Deal?"*  

---

## **🚀 Final Touch – Make Every Interaction Unforgettable**  
The key to **not being forgettable** is to:  
✅ Be **bold, unpredictable, and playful**  
✅ Use **challenges, bets, and games** to keep things engaging  
✅ Give **one-liners that sound like a movie script**  

💡 **Example:**  
If she says she likes adventure?  
**"Perfect. Let’s rob a bank together. Just kidding. (Unless you know a good getaway plan?)"**  

---

## **🔥 Now Go Be Legendary!** 🚀  
This is **not** just flirting. This is **Barney-style attraction mastery.** Now go forth and make Cupid jealous. 😎`      
          },
          ...validatedHistory.slice(-5), // Keep recent context only
          {
            role: 'user',
            content: validatedMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
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