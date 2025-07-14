const LoginHistory = require('../models/LoginHistory');



exports.trackLoginDate = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get the current date without time for comparison
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Set time to midnight (start of the day)
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Set time to the end of the day (just before midnight)

    // Check if a login entry already exists for today
    const existingLogin = await LoginHistory.findOne({
      user: userId,
      loginDate: { $gte: startOfDay, $lte: endOfDay },  // Find a login entry for today
    });

    // If a login entry for today exists, return without saving
    if (existingLogin) {
      console.log('Login already recorded for today');
      return;
    }

    // Create a new login entry for the user since no login exists for today
    const loginHistory = new LoginHistory({
      user: userId,
      loginDate: new Date(),  // Set login date to current date and time
    });

    // Save the login entry to the database
    await loginHistory.save();
    console.log('Login date saved successfully');
  } catch (error) {
    console.error('Error tracking login date:', error);
    throw error;  // Re-throw the error to be caught in the login function
  }
};



// Function to fetch all login dates for the authenticated user
exports.getLoggedDates = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all login dates for the user
        const loggedDates = await LoginHistory.find({ user: userId }).select('loginDate -_id');

        // Format the dates to only show the date part (YYYY-MM-DD)
        const formattedDates = loggedDates.map((entry) => entry.loginDate.toISOString().slice(0, 10));

        res.json({ loggedDates: formattedDates });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch logged dates' });
    }
};
