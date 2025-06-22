// Main application entry point
import { fetchConferenceData } from './modules/dataService.js';
import { renderSchedule, filterSessionsByTag } from './modules/scheduleRenderer.js';
import { setupSearch } from './modules/searchService.js';
import { setupTabNavigation } from './modules/navigationService.js';
import { setupSessionDetails } from './modules/sessionDetailService.js';
import { setupTagCloud, resetTagFilter } from './modules/tagCloudService.js';

// Constants
const APP_INIT_DELAY = 100; // Small delay to ensure DOM is fully loaded
const VERSION = '1.1.0'; // Application version with tag cloud feature

/**
 * Initialize the application
 * Loads data and sets up UI components
 */
const initApp = async () => {
    try {
        // Fetch conference data
        const conferenceData = await fetchConferenceData();
        
        if (!conferenceData) {
            throw new Error('Failed to load conference data');
        }
        
        // Set up UI components
        setupTabNavigation(conferenceData);
        renderSchedule(conferenceData);
        setupSearch(conferenceData);
        setupSessionDetails(conferenceData);
        
        // Set up tag cloud
        const tagCloudContainer = document.getElementById('tag-cloud-container');
        setupTagCloud(conferenceData, tagCloudContainer);
        
        // Setup tag filter event listener
        document.addEventListener('filter-by-tag', (event) => {
            const tag = event.detail.tag;
            filterSessionsByTag(tag, conferenceData);
        });
        
        // Setup reset tag filter event listener
        document.addEventListener('reset-tag-filter', () => {
            resetTagFilter();
        });
        
        console.log('Conference app initialized successfully');
    } catch (error) {
        console.error('Application initialization failed:', error);
        document.getElementById('schedule-content').innerHTML = 
            `<div class="error-message">Failed to load conference data. Please try again later.</div>`;
    }
};

// Initialize the app with a small delay to ensure DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initApp, APP_INIT_DELAY);
});
