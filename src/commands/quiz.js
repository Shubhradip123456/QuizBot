const { fetchQuizQuestions } = require('../services/quizService');

async function handleQuizCommand(bot, chatId, userState) {
  // Fetch all quiz questions
  const questions = await fetchQuizQuestions();

  if (!questions || questions.length === 0) {
    bot.sendMessage(chatId, 'No quiz questions found!');
    return;
  }

  // Initialize or reset user state
  if (!userState[chatId]) {
    userState[chatId] = { currentQuestionIndex: 0 };
  }

  const currentQuestionIndex = userState[chatId].currentQuestionIndex;

  if (currentQuestionIndex >= questions.length) {
    bot.sendMessage(chatId, '🎉 You have completed the quiz!');
    delete userState[chatId]; // Reset user state after quiz completion
    return;
  }

  const question = questions[currentQuestionIndex];
  const questionText = question.question;

  // Assuming options are stored as an array in the database
  const options = Array.isArray(question.options) ? question.options : question.options.split(';');  // If options are not an array, split by ';'

  const optionsMarkup = {
    reply_markup: {
      inline_keyboard: options.map(option => [{ text: option, callback_data: option }]),
    },
  };

  bot.sendMessage(chatId, questionText, optionsMarkup);

  // Update user state to reflect the next question
  userState[chatId].correctAnswer = question.correct_answer;
  userState[chatId].currentQuestionIndex += 1;
}

module.exports = { handleQuizCommand };
