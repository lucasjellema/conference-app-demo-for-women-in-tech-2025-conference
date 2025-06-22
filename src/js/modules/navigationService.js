/**
 * Navigation Service Module
 * Handles tab navigation between different days of the conference
 */
import { setActiveDay } from './scheduleRenderer.js';

// Constants
const ACTIVE_CLASS = 'active';

/**
 * Sets up tab navigation for switching between conference days
 * @param {Object} conferenceData - The complete conference data object
 */
export const setupTabNavigation = (conferenceData) => {
    // Find all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Add click event listeners to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedDayId = event.target.getAttribute('data-day');
            handleDaySelection(selectedDayId, tabButtons);
        });
    });
};

/**
 * Handles day selection in the UI
 * @param {String} dayId - The ID of the selected day
 * @param {NodeList} tabButtons - Collection of all tab buttons
 */
const handleDaySelection = (dayId, tabButtons) => {
    if (!dayId) {
        console.error('Invalid day ID');
        return;
    }
    
    // Update active tab button
    updateActiveTab(dayId, tabButtons);
    
    // Update the schedule view
    setActiveDay(dayId);
};

/**
 * Updates the active tab in the UI
 * @param {String} dayId - The ID of the selected day
 * @param {NodeList} tabButtons - Collection of all tab buttons
 */
const updateActiveTab = (dayId, tabButtons) => {
    // Remove active class from all tabs
    tabButtons.forEach(tab => {
        tab.classList.remove(ACTIVE_CLASS);
    });
    
    // Add active class to selected tab
    const selectedTab = document.querySelector(`.tab-btn[data-day="${dayId}"]`);
    if (selectedTab) {
        selectedTab.classList.add(ACTIVE_CLASS);
    }
};
