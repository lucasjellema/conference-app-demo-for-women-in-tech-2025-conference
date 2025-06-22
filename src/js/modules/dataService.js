/**
 * Data Service Module
 * Handles fetching and processing conference data
 */

// Path to the conference data file
const DATA_PATH = '/src/data/conference-data.json';

/**
 * Fetches conference data from the JSON file
 * @returns {Promise<Object>} The conference data object
 */
export const fetchConferenceData = async () => {
    try {
        const response = await fetch(DATA_PATH);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching conference data:', error);
        throw error;
    }
};

/**
 * Get all sessions from all days combined
 * @param {Object} conferenceData - The complete conference data object
 * @returns {Array} Array of all sessions with day information added
 */
export const getAllSessions = (conferenceData) => {
    if (!conferenceData || !conferenceData.days) {
        return [];
    }
    
    // Extract all sessions and add day information to each session
    return conferenceData.days.flatMap(day => {
        return day.sessions.map(session => ({
            ...session,
            dayId: day.id,
            dayName: day.name,
            date: day.date
        }));
    });
};

/**
 * Get sessions for a specific day
 * @param {Object} conferenceData - The complete conference data object
 * @param {String} dayId - The ID of the day to get sessions for
 * @returns {Array} Array of sessions for the specified day
 */
export const getSessionsByDay = (conferenceData, dayId) => {
    if (!conferenceData || !conferenceData.days) {
        return [];
    }
    
    const day = conferenceData.days.find(d => d.id === dayId);
    return day ? day.sessions : [];
};

/**
 * Get a specific session by its ID
 * @param {Object} conferenceData - The complete conference data object
 * @param {String} sessionId - The ID of the session to find
 * @returns {Object|null} The session object or null if not found
 */
export const getSessionById = (conferenceData, sessionId) => {
    const allSessions = getAllSessions(conferenceData);
    return allSessions.find(session => session.id === sessionId) || null;
};
