/**
 * Session Detail Service Module
 * Handles displaying detailed information about a selected session
 */
import { getSessionById } from './dataService.js';
import { setActiveDay } from './scheduleRenderer.js';

// DOM element references
const sessionDetailElement = document.getElementById('session-detail');
const sessionModalElement = document.getElementById('session-modal');
const modalOverlayElement = document.getElementById('modal-overlay');
const modalCloseElement = document.querySelector('.modal-close');

// Constants
const ACTIVE_CLASS = 'active';

/**
 * Sets up session detail view functionality
 * @param {Object} conferenceData - The complete conference data object
 */
export const setupSessionDetails = (conferenceData) => {
    // Listen for session selection events
    document.addEventListener('session-selected', (event) => {
        const sessionId = event.detail.sessionId;
        showSessionDetails(sessionId, conferenceData);
    });
    
    // Set up modal close functionality
    modalCloseElement.addEventListener('click', hideSessionDetails);
    
    // Also close the modal when clicking on the overlay
    modalOverlayElement.addEventListener('click', hideSessionDetails);
    
    // Close modal on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            hideSessionDetails();
        }
    });
};

/**
 * Shows the details for a specific session
 * @param {String} sessionId - The ID of the session to display
 * @param {Object} conferenceData - The complete conference data object
 */
const showSessionDetails = (sessionId, conferenceData) => {
    // Get the session data
    const session = getSessionById(conferenceData, sessionId);
    
    if (!session) {
        console.error('Session not found:', sessionId);
        return;
    }
    
    // Create the detail view content
    sessionDetailElement.innerHTML = createSessionDetailContent(session);
    
    // Show the modal and overlay
    sessionModalElement.classList.add(ACTIVE_CLASS);
    modalOverlayElement.classList.add(ACTIVE_CLASS);
    
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';
    
    // Make sure the correct day is selected
    if (session.dayId) {
        // Update tab and schedule view to show the day this session is on
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-day') === session.dayId) {
                btn.classList.add(ACTIVE_CLASS);
            } else {
                btn.classList.remove(ACTIVE_CLASS);
            }
        });
        
        setActiveDay(session.dayId);
        
        // Scroll to the session in the schedule
        setTimeout(() => {
            const sessionElement = document.querySelector(`.session[data-session-id="${sessionId}"]`);
            if (sessionElement) {
                sessionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight the session briefly
                sessionElement.classList.add('highlight');
                setTimeout(() => {
                    sessionElement.classList.remove('highlight');
                }, 1500);
            }
        }, 300);
    }
};

/**
 * Creates HTML content for the session detail view
 * @param {Object} session - The session object
 * @returns {String} HTML content for the detail view
 */
const createSessionDetailContent = (session) => {
    let content = `
        <h2 class="session-detail-title">${session.title}</h2>
    `;
    
    // Add day and time information
    content += `<div class="session-detail-time">${session.dayName} at ${session.time}`;
    
    if (session.room) {
        content += ` • ${session.room}`;
    }
    
    content += '</div>';
    
    // Add speaker information if available
    if (session.speaker) {
        content += `<div class="session-detail-speaker">${session.speaker}</div>`;
        
        if (session.role || session.company) {
            content += '<div class="session-detail-company">';
            
            if (session.role) {
                content += session.role;
                if (session.company) {
                    content += ', ';
                }
            }
            
            if (session.company) {
                content += session.company;
            }
            
            content += '</div>';
        }
    }
    
    // Add description if available
    if (session.description) {
        content += `<div class="session-detail-description">${session.description}</div>`;
    }
    
    // Add tags if available
    if (session.tags && session.tags.length) {
        content += '<div class="session-detail-tags">';
        
        session.tags.forEach(tag => {
            content += `<span class="tag">${tag}</span>`;
        });
        
        content += '</div>';
    }
    
    return content;
};

/**
 * Hides the session detail modal
 */
export const hideSessionDetails = () => {
    sessionModalElement.classList.remove(ACTIVE_CLASS);
    modalOverlayElement.classList.remove(ACTIVE_CLASS);
    
    // Restore body scrolling
    document.body.style.overflow = '';
};
