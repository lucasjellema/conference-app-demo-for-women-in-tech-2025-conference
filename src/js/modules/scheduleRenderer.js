/**
 * Schedule Renderer Module
 * Responsible for rendering the conference schedule in the UI
 */
import { getSessionsByDay } from './dataService.js';

// DOM element references
const scheduleContentElement = document.getElementById('schedule-content');

// State variables
let currentFilter = null;

// Constants for styling different session types
const SESSION_TYPE_CLASSES = {
    keynote: 'keynote-session',
    break: 'break-session',
    round1: 'round-session',
    round2: 'round-session'
};

/**
 * Render the complete schedule for the conference
 * @param {Object} conferenceData - The complete conference data object
 */
export const renderSchedule = (conferenceData, filterTag = null) => {
    if (!conferenceData || !conferenceData.days || !conferenceData.days.length) {
        console.error('Invalid conference data provided to renderer');
        return;
    }
    
    // Store current filter
    currentFilter = filterTag;
    
    // Clear existing content
    scheduleContentElement.innerHTML = '';
    
    // If we have a filter tag, add a heading and clear button
    if (filterTag) {
        const filterHeading = document.createElement('div');
        filterHeading.classList.add('filtered-sessions-heading');
        filterHeading.innerHTML = `
            <span>Showing sessions tagged with: <strong>${filterTag}</strong></span>
            <button class="clear-filter-btn">Clear filter</button>
        `;
        
        // Add click handler to clear filter button
        const clearButton = filterHeading.querySelector('.clear-filter-btn');
        clearButton.addEventListener('click', () => {
            renderSchedule(conferenceData);
            
            // Dispatch event to reset tag cloud
            const event = new CustomEvent('reset-tag-filter');
            document.dispatchEvent(event);
        });
        
        scheduleContentElement.appendChild(filterHeading);
    }
    
    // Create a container for each day's schedule
    conferenceData.days.forEach(day => {
        const dayScheduleElement = createDayScheduleElement(day, conferenceData, filterTag);
        
        // Only add the day if it has visible sessions
        if (dayScheduleElement.querySelectorAll('.session').length > 0) {
            scheduleContentElement.appendChild(dayScheduleElement);
        }
    });
    
    // Make the first day active by default
    const firstDayElement = document.querySelector('.day-schedule');
    if (firstDayElement) {
        firstDayElement.classList.add('active');
    } else if (filterTag) {
        // If no days are visible with the filter, show a message
        const noResults = document.createElement('div');
        noResults.classList.add('no-results');
        noResults.textContent = `No sessions found with the tag: ${filterTag}`;
        scheduleContentElement.appendChild(noResults);
    }
};

/**
 * Creates a DOM element for a day's schedule
 * @param {Object} day - The day object containing sessions
 * @param {Object} conferenceData - The complete conference data object
 * @returns {HTMLElement} The day schedule element
 */
const createDayScheduleElement = (day, conferenceData, filterTag = null) => {
    const dayScheduleElement = document.createElement('div');
    dayScheduleElement.classList.add('day-schedule');
    dayScheduleElement.setAttribute('data-day', day.id);
    
    let sessionsForDay = getSessionsByDay(conferenceData, day.id);
    
    // If we have a filter tag, filter the sessions
    if (filterTag) {
        sessionsForDay = sessionsForDay.filter(session => 
            session.tags && session.tags.includes(filterTag)
        );
    }
    
    // Group sessions by time
    const sessionsByTime = groupSessionsByTime(sessionsForDay);
    
    // Create elements for each time slot
    Object.keys(sessionsByTime).forEach(time => {
        const timeSlotElement = createTimeSlotElement(time, sessionsByTime[time]);
        dayScheduleElement.appendChild(timeSlotElement);
    });
    
    return dayScheduleElement;
};

/**
 * Groups sessions by their start time
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Sessions grouped by time
 */
const groupSessionsByTime = (sessions) => {
    const groupedSessions = {};
    
    sessions.forEach(session => {
        if (!groupedSessions[session.time]) {
            groupedSessions[session.time] = [];
        }
        groupedSessions[session.time].push(session);
    });
    
    return groupedSessions;
};

/**
 * Creates a DOM element for a time slot with all its sessions
 * @param {String} time - The time slot
 * @param {Array} sessions - Array of sessions at this time
 * @returns {HTMLElement} The time slot element
 */
const createTimeSlotElement = (time, sessions) => {
    const timeSlotElement = document.createElement('div');
    timeSlotElement.classList.add('time-slot');
    
    const timeHeader = document.createElement('div');
    timeHeader.classList.add('time-slot-header');
    timeHeader.textContent = time;
    timeSlotElement.appendChild(timeHeader);
    
    const sessionsContainer = document.createElement('div');
    sessionsContainer.classList.add('sessions-container');
    
    sessions.forEach(session => {
        const sessionElement = createSessionElement(session);
        sessionsContainer.appendChild(sessionElement);
    });
    
    timeSlotElement.appendChild(sessionsContainer);
    return timeSlotElement;
};

/**
 * Creates a DOM element for a single session
 * @param {Object} session - The session object
 * @returns {HTMLElement} The session element
 */
const createSessionElement = (session) => {
    const sessionElement = document.createElement('div');
    sessionElement.classList.add('session');
    sessionElement.setAttribute('data-session-id', session.id);
    
    // Add accessibility attributes to indicate clickability
    sessionElement.setAttribute('role', 'button');
    sessionElement.setAttribute('tabindex', '0');
    sessionElement.title = 'Click to view session details';
    
    // Add specific class based on session type
    if (SESSION_TYPE_CLASSES[session.type]) {
        sessionElement.classList.add(SESSION_TYPE_CLASSES[session.type]);
    }
    
    // Add session room if available
    if (session.room) {
        const roomElement = document.createElement('div');
        roomElement.classList.add('session-room');
        roomElement.textContent = session.room;
        sessionElement.appendChild(roomElement);
    }
    
    // Add session title
    const titleElement = document.createElement('div');
    titleElement.classList.add('session-title');
    titleElement.textContent = session.title;
    sessionElement.appendChild(titleElement);
    
    // Add speaker info if available
    if (session.speaker) {
        const speakerElement = document.createElement('div');
        speakerElement.classList.add('session-speaker');
        speakerElement.textContent = session.speaker;
        sessionElement.appendChild(speakerElement);
    }
    
    // Add tags if available
    if (session.tags && session.tags.length) {
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('session-tags');
        
        session.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag');
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        sessionElement.appendChild(tagsContainer);
    }
    
    // Function to trigger session details display
    const showSessionDetail = () => {
        console.log('Triggering session detail for:', session.id);
        // Dispatch custom event to show session details
        const event = new CustomEvent('session-selected', {
            detail: {
                sessionId: session.id
            }
        });
        document.dispatchEvent(event);
    };
    
    // Add click event to show session details
    sessionElement.addEventListener('click', showSessionDetail);
    
    // Add keyboard event handling for accessibility
    sessionElement.addEventListener('keydown', (e) => {
        // Trigger on Enter or Space key
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showSessionDetail();
        }
    });
    
    return sessionElement;
};

/**
 * Updates the active day in the schedule view
 * @param {String} dayId - The ID of the day to activate
 */
export const setActiveDay = (dayId) => {
    // Remove active class from all day schedules
    document.querySelectorAll('.day-schedule').forEach(el => {
        el.classList.remove('active');
    });
    
    // Add active class to the selected day schedule
    const selectedDayElement = document.querySelector(`.day-schedule[data-day="${dayId}"]`);
    if (selectedDayElement) {
        selectedDayElement.classList.add('active');
    }
};

/**
 * Filter sessions by tag
 * @param {String} tag - Tag to filter by
 * @param {Object} conferenceData - Conference data object
 */
export const filterSessionsByTag = (tag, conferenceData) => {
    renderSchedule(conferenceData, tag);
    
    // Switch to schedule view
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    scheduleContentElement.classList.add('active');
    
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.tab-btn[data-day="day1"]').classList.add('active');
};
