# Conference Schedule Application

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

The Conference Schedule Application is an interactive web application for conference attendees to browse sessions, search for topics of interest, and plan their conference experience. This application provides a clean, intuitive interface for exploring a multi-day conference schedule with various session types including keynotes, regular sessions, workshops, and networking events.

## Features

- **Day-based Navigation**: Browse conference schedule by day with easy tab navigation
- **Detailed Session Information**: View comprehensive details about each session including:
  - Title, speaker, and room location
  - Speaker's role and company
  - Detailed description
  - Session tags for easy categorization
- **Interactive Session Modal**: Click on any session to open a detailed view in a modal popup
- **Tag Cloud Exploration**: Browse sessions by topics with an interactive tag cloud
  - View popularity of topics with size-based visualization
  - Filter sessions by clicking on tags
  - See only sessions relevant to selected topics
- **Powerful Search Functionality**: Search across all sessions by title, speaker, description, or tags
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility Support**: Keyboard navigation and aria attributes for better accessibility

## Technology Stack

- **HTML5**: Modern semantic markup
- **CSS3**: Responsive styling with clean design principles
- **JavaScript (ES Modules)**: Modular JavaScript code with no external dependencies
- **JSON**: Local data storage for conference schedule information

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development purposes)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/conference-app.git
   cd conference-app
   ```

2. Start a local web server
   ```
   npx http-server -c-1
   ```

3. Open your browser and navigate to `http://localhost:8080`

## Usage

- **Viewing Schedule**: By default, the app opens showing Day 1 schedule. Use the tabs at the top to switch between days.
- **Session Details**: Click on any session card to view detailed information in a popup modal.
- **Searching**: Type in the search box at the top of the page to find sessions matching your interests.
- **Topic Exploration**: Click on the "Topics" tab to view a tag cloud of all session topics. The size of each tag represents the number of sessions with that topic. Click on any tag to filter the schedule and show only sessions with that tag.
  - Once filtered, you'll see only sessions with your selected tag across all days
  - Use the "Clear filter" button to return to the full schedule
  - Tags are sized proportionally to their frequency in the schedule
- **Navigation**: Navigate between days using the tab buttons. Close modal popups by clicking the X button, clicking outside the modal, or pressing the ESC key.

## Data Structure

The application uses a JSON data file stored in `src/data/conference-data.json`. This file contains all conference sessions structured by day. Each session includes details like time, location, speaker information, description, and tags.

To modify the conference data, simply edit the JSON file while maintaining the existing structure.

## Customization

- **Styling**: Modify the CSS in `src/css/styles.css` to match your branding
- **Conference Information**: Update the conference name, dates, and sessions in the JSON data file
- **Additional Features**: The modular structure makes it easy to extend with new features

## Deployment

### Local Development

1. Clone the repository
   ```
   git clone https://github.com/yourusername/conference-app.git
   cd conference-app
   ```

2. Start a local web server
   ```
   npx http-server -c-1
   ```

3. Open your browser and navigate to `http://localhost:8080`

### Deploying to GitHub Pages

1. Create a GitHub repository for your project (if you haven't already)

2. Push your code to GitHub
   ```
   git add .
   git commit -m "Ready for GitHub Pages deployment"
   git push origin main
   ```

3. Enable GitHub Pages in your repository settings:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to the "GitHub Pages" section
   - Under "Source", select "main" branch
   - Click "Save"

4. Access your deployed application at:
   ```
   https://yourusername.github.io/repository-name/
   ```

#### Note on GitHub Pages Deployment

The application is configured to automatically detect when it's running on GitHub Pages and adjust file paths accordingly. This is handled by the dynamic path detection in `dataService.js`, which ensures resources load correctly regardless of the hosting environment.

## Future Enhancements

- User authentication for personalized schedules
- Calendar integration for session reminders
- Speaker profiles and additional information pages
- Feedback and rating system for sessions
- Offline support using service workers
- Additional filtering options beyond tags

## License

This project is open source and available under the MIT License.

---

Created by [Your Name] for conference organizers and attendees.
