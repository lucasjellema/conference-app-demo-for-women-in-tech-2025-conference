/**
 * Tag Cloud Service Module
 * Handles generating and displaying a tag cloud with session counts
 */
import { getAllSessions } from './dataService.js';

// DOM element references
let tagCloudContainerElement;

// Constants
const ACTIVE_CLASS = 'active';
const MIN_FONT_SIZE = 1; // em
const MAX_FONT_SIZE = 2.2; // em

/**
 * Sets up tag cloud functionality
 * @param {Object} conferenceData - The complete conference data object
 * @param {HTMLElement} containerElement - The container element to render the tag cloud in
 */
export const setupTagCloud = (conferenceData, containerElement) => {
    // Store reference to the container
    tagCloudContainerElement = containerElement;
    
    // Generate and render the tag cloud
    renderTagCloud(conferenceData);
    
    // Set up tab click handler if we're using tabs
    const tagCloudTab = document.getElementById('tag-cloud-tab');
    if (tagCloudTab) {
        tagCloudTab.addEventListener('click', () => {
            // Show tag cloud container
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove(ACTIVE_CLASS);
            });
            tagCloudContainerElement.classList.add(ACTIVE_CLASS);
            
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(tab => {
                tab.classList.remove(ACTIVE_CLASS);
            });
            tagCloudTab.classList.add(ACTIVE_CLASS);
        });
    }
};

/**
 * Renders the tag cloud in the specified container
 * @param {Object} conferenceData - The complete conference data object
 */
const renderTagCloud = (conferenceData) => {
    // Get tag counts from all sessions
    const tagCounts = getTagCounts(conferenceData);
    
    // Clear existing content
    tagCloudContainerElement.innerHTML = '';
    
    // Create heading
    const heading = document.createElement('h2');
    heading.textContent = 'Session Topics';
    tagCloudContainerElement.appendChild(heading);
    
    // Create tag cloud container
    const cloudContainer = document.createElement('div');
    cloudContainer.classList.add('tag-cloud');
    
    // Determine max and min counts for sizing
    const counts = Object.values(tagCounts);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    
    // Create a tag element for each tag
    Object.keys(tagCounts).sort().forEach(tag => {
        const count = tagCounts[tag];
        const tagElement = createTagElement(tag, count, minCount, maxCount);
        cloudContainer.appendChild(tagElement);
    });
    
    // Add the cloud to the container
    tagCloudContainerElement.appendChild(cloudContainer);
};

/**
 * Creates a DOM element for a single tag in the cloud
 * @param {String} tag - The tag text
 * @param {Number} count - The number of sessions with this tag
 * @param {Number} minCount - The smallest count in the tag set
 * @param {Number} maxCount - The largest count in the tag set
 * @returns {HTMLElement} The tag element
 */
const createTagElement = (tag, count, minCount, maxCount) => {
    const tagElement = document.createElement('span');
    tagElement.classList.add('tag-cloud-item');
    tagElement.textContent = tag;
    
    // Add count as a tooltip
    tagElement.setAttribute('title', `${count} session${count !== 1 ? 's' : ''}`);
    
    // Calculate font size based on count
    // Using linear interpolation between MIN_FONT_SIZE and MAX_FONT_SIZE
    let fontSize = MIN_FONT_SIZE;
    if (maxCount !== minCount) {
        fontSize = MIN_FONT_SIZE + 
            ((count - minCount) / (maxCount - minCount)) * 
            (MAX_FONT_SIZE - MIN_FONT_SIZE);
    }
    
    // Set the font size
    tagElement.style.fontSize = `${fontSize}em`;
    
    // Add click handler to show sessions with this tag
    tagElement.addEventListener('click', () => {
        showSessionsByTag(tag);
    });
    
    return tagElement;
};

/**
 * Counts the occurrences of each tag across all sessions
 * @param {Object} conferenceData - The complete conference data object
 * @returns {Object} An object with tags as keys and counts as values
 */
const getTagCounts = (conferenceData) => {
    const tagCounts = {};
    const allSessions = getAllSessions(conferenceData);
    
    // Count tags across all sessions
    allSessions.forEach(session => {
        if (session.tags && Array.isArray(session.tags)) {
            session.tags.forEach(tag => {
                if (!tagCounts[tag]) {
                    tagCounts[tag] = 0;
                }
                tagCounts[tag]++;
            });
        }
    });
    
    return tagCounts;
};

/**
 * Shows all sessions that have the specified tag
 * @param {String} tag - The tag to filter sessions by
 */
const showSessionsByTag = (tag) => {
    // Dispatch custom event to filter sessions by tag
    const event = new CustomEvent('filter-by-tag', {
        detail: {
            tag: tag
        }
    });
    document.dispatchEvent(event);
    
    // Add active class to the clicked tag
    const tagElements = document.querySelectorAll('.tag-cloud-item');
    tagElements.forEach(el => {
        if (el.textContent === tag) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
};

/**
 * Resets any active tag filters
 */
export const resetTagFilter = () => {
    const tagElements = document.querySelectorAll('.tag-cloud-item');
    tagElements.forEach(el => {
        el.classList.remove('active');
    });
};
