const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN } = require('./config');
const { handleQuizCommand } = require('./commands/quiz');

// Initialize Telegram bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Store user quiz state
const userState = {};

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

  if (userState[chatId] && userState[chatId].correctAnswer === answer) {
    bot.sendMessage(chatId, '🎉 Correct!');
  } else {
    bot.sendMessage(chatId, `❌ Wrong! The correct answer was: ${userState[chatId].correctAnswer}`);
  }

  // Continue with the next question
  handleQuizCommand(bot, chatId, userState);
});
