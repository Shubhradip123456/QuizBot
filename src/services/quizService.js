const supabase = require('./supabaseService');

// Fetch all quiz questions in order
async function fetchQuizQuestions() {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('id', { ascending: true }); // Assuming questions are ordered by ID

  if (error) {
    console.error('Error fetching quiz questions:', error);
    return null;
  }

  return data; // Return all quiz questions
}

module.exports = { fetchQuizQuestions };
