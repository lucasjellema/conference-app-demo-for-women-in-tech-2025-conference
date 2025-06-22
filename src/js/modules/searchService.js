/**
 * Search Service Module
 * Handles searching for sessions across the conference
 */
import { getAllSessions } from './dataService.js';

// DOM element references
const searchInputElement = document.getElementById('search-input');
const searchResultsElement = document.getElementById('search-results');

// Constants
const MIN_SEARCH_LENGTH = 2; // Minimum number of characters to trigger search
const SEARCH_DEBOUNCE_TIME = 300; // Time in ms to wait before searching after typing
const MAX_RESULTS = 5; // Maximum number of search results to display

// Variables
let debounceTimer = null;
let allSessions = [];

/**
 * Sets up search functionality
 * @param {Object} conferenceData - The complete conference data object
 */
export const setupSearch = (conferenceData) => {
    // Store all sessions for searching
    allSessions = getAllSessions(conferenceData);
    
    // Add input event to search field
    searchInputElement.addEventListener('input', (event) => {
        const searchTerm = event.target.value.trim();
        
        // Clear any existing timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        
        // Hide results if search is empty
        if (searchTerm.length < MIN_SEARCH_LENGTH) {
            hideSearchResults();
            return;
        }
        
        // Debounce search for better performance
        debounceTimer = setTimeout(() => {
            performSearch(searchTerm);
        }, SEARCH_DEBOUNCE_TIME);
    });
    
    // Hide search results when clicking elsewhere
    document.addEventListener('click', (event) => {
        if (!searchInputElement.contains(event.target) && 
            !searchResultsElement.contains(event.target)) {
            hideSearchResults();
        }
    });
};

/**
 * Performs search on all sessions based on search term
 * @param {String} searchTerm - The term to search for
 */
const performSearch = (searchTerm) => {
    // Create a case-insensitive RegExp for searching
    const searchRegex = new RegExp(searchTerm, 'i');
    
    // Find matching sessions
    const results = allSessions.filter(session => {
        return (
            (session.title && searchRegex.test(session.title)) || 
            (session.speaker && searchRegex.test(session.speaker)) ||
            (session.description && searchRegex.test(session.description)) ||
            (session.tags && session.tags.some(tag => searchRegex.test(tag)))
        );
    }).slice(0, MAX_RESULTS); // Limit number of results
    
    displaySearchResults(results);
};

/**
 * Displays search results in the UI
 * @param {Array} results - The search results to display
 */
const displaySearchResults = (results) => {
    // Clear previous results
    searchResultsElement.innerHTML = '';
    
    if (results.length === 0) {
        const noResultsElement = document.createElement('div');
        noResultsElement.classList.add('search-result-item');
        noResultsElement.textContent = 'No matching sessions found';
        searchResultsElement.appendChild(noResultsElement);
    } else {
        // Create an element for each result
        results.forEach(session => {
            const resultElement = createSearchResultElement(session);
            searchResultsElement.appendChild(resultElement);
        });
    }
    
    // Show the results container
    searchResultsElement.style.display = 'block';
};

/**
 * Creates a DOM element for a search result
 * @param {Object} session - The session object
 * @returns {HTMLElement} The search result element
 */
const createSearchResultElement = (session) => {
    const resultElement = document.createElement('div');
    resultElement.classList.add('search-result-item');
    
    // Create result content
    const titleElement = document.createElement('div');
    titleElement.classList.add('result-title');
    titleElement.textContent = session.title;
    
    const detailsElement = document.createElement('div');
    detailsElement.classList.add('result-details');
    
    // Show day, time, and speaker information
    let detailsText = `${session.dayName} at ${session.time}`;
    if (session.speaker) {
        detailsText += ` • ${session.speaker}`;
    }
    
    detailsElement.textContent = detailsText;
    
    resultElement.appendChild(titleElement);
    resultElement.appendChild(detailsElement);
    
    // Add click event to select this session
    resultElement.addEventListener('click', () => {
        // Dispatch custom event to show session details
        const event = new CustomEvent('session-selected', {
            detail: {
                sessionId: session.id
            }
        });
        document.dispatchEvent(event);
        
        // Clear search and hide results
        searchInputElement.value = '';
        hideSearchResults();
    });
    
    return resultElement;
};

/**
 * Hides the search results container
 */
const hideSearchResults = () => {
    searchResultsElement.style.display = 'none';
};
