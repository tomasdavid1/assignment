# Test Scheduler App

## Overview

Hi! Following the requirements I made this carbon copy of a Test Scheduler App. It's an application designed to manage and visualize scheduled tests efficiently. It features a calendar interface where users can add, edit, and view test schedules with repeatable weekly patterns. The app utilizes modern tools such as Next.js, Supabase, and TailwindCSS to ensure a seamless user experience.

---

## Features

- **Dynamic Calendar**:
  - Displays weekly schedules.
  - Allows navigation between weeks with intuitive controls.
  - Highlights scheduled events with visual clarity.
  - Filters by time, start date and potentially end date. Implemented, not required

- **Event Management**:
  - Add new events using a modal form.
  - Edit existing events by clicking on them in the calendar.
  - Set start date, time, and repeat days for events.
  
- **State Management**:
  - Optimistic UI updates for immediate feedback.
  - Context providers for shared state across components.
    


- **Database Integration**:
  - Real-time updates using Supabase's `postgres_changes`.
  - Persistent storage for events.

---

## Tech Stack

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Context and Hooks
- **Date Utilities**: `date-fns`

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tomasdavid1/assignment.git
   ```

2. Navigate to the project directory:
   ```bash
   cd assignment
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   - Create a `.env.local` file in the root directory.
   - Add your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://xgzphwuogakqwaytnezy.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnenBod3VvZ2FrcXdheXRuZXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNDYwODEsImV4cCI6MjA1MDcyMjA4MX0.iZlpvgkHmptsZS3ghoW3hOEwJYhBNS-nihai1mAtFcQ
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open the app in your browser:
   ```
   http://localhost:3000
   ```

---

## Usage

### Adding an Event
1. Click the **+ Schedule Test** button.
2. Fill out the modal form:
   - Select a test suite.
   - Set a start date and time.
   - Choose repeat days (e.g., Mon, Wed, Fri).
3. Click **Save Changes** to schedule the test.

### Editing an Event
1. Click on an event in the calendar.
2. Modify the fields in the modal form.
3. Click **Save Changes** to update the event.

### Deleting an Event
1. Open an event in the modal.
2. Click **Cancel Schedule** to remove the event.

### Navigating Weeks
- Use the **‹ Week of MM/DD/YYYY ›** control to move between weeks.
- Click on the left or right part of the control to navigate backward or forward.

---

## Project Structure

```plaintext
📂 src
├── 📂 components
│   ├── 📂 Calendar
│   │   ├── Calendar.tsx            # Main calendar component. Tricky to implement from scratch!
│   │   ├── Components
│   │   │   ├── CalendarDates.tsx  # Displays days of the week
│   │   │   ├── CalendarHeader.tsx # Controls for week navigation
│   │   │   └── EventModal.tsx     # Modal for adding/editing events
│   │   └── hooks
│   │       └── useCalendar.tsx    # Custom hook for fetching events
│   └── Event.tsx                  # Single event rendering component
├── 📂 providers
│   ├── Calendar-provider.tsx      # Manages week navigation and event state
│   ├── EventModal-provider.tsx    # Manages modal visibility and event state
│   └── Supabase-provider.tsx      # Provides Supabase client
├── 📂 styles
│   └── globals.css                # Global styles using TailwindCSS
└── app
    └── layout.tsx                 # Root layout with providers. There weren't many pages.
```



## Development Notes

- **Optimistic Updates**: Events are added to the UI immediately after scheduling, ensuring a responsive experience.
- **Real-Time Updates**: Supabase listens for changes to the `events` table and updates the calendar dynamically.
- **Custom Styling**: TailwindCSS is used for modern, responsive designs.

---

## Future Enhancements

- Add support for recurring events with end dates.
- Implement drag-and-drop functionality for events.
- Enhance event filtering and search.
- Improve accessibility (ARIA roles, keyboard navigation).

---


## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and open a pull request.

---

## Acknowledgments

- [Supabase](https://supabase.io/) for their powerful database and real-time features.
- [TailwindCSS](https://tailwindcss.com/) for seamless styling.
- [date-fns](https://date-fns.org/) for date manipulation.

---

Thanks!! 🎉