const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { TELEGRAM_BOT_TOKEN } = require('./config');
const { handleQuizCommand } = require('./commands/quiz');

// Initialize Express
const app = express();
app.use(express.json());

// Store user quiz state
const userState = {};

// Initialize Telegram bot in Webhook mode
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { webHook: true });

// Replace this with your actual deployment URL
const serverUrl = process.env.SERVER_URL || 'https://your-vercel-deployment.vercel.app';
bot.setWebHook(`${serverUrl}/bot${TELEGRAM_BOT_TOKEN}`);

// Define webhook endpoint for Telegram updates
app.post(`/bot${TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body); // Process updates from Telegram
  res.sendStatus(200);
});

// Start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome to the Quiz Bot! Type /quiz to start.');
});

// Quiz command
bot.onText(/\/quiz/, (msg) => {
  const chatId = msg.chat.id;
  handleQuizCommand(bot, chatId, userState);
});

// Handle answer selection
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const answer = callbackQuery.data;

  // Check if userState exists and verify the answer
  if (userState[chatId] && userState[chatId].correctAnswer === answer) {
    bot.sendMessage(chatId, '🎉 Correct!');
  } else if (userState[chatId]) {
    bot.sendMessage(chatId, `❌ Wrong! The correct answer was: ${userState[chatId].correctAnswer}`);
  } else {
    bot.sendMessage(chatId, '⚠️ No active quiz question. Type /quiz to start again.');
  }

  // Continue with the next question
  handleQuizCommand(bot, chatId, userState);
});

// Export the Express app for deployment
module.exports = app;
