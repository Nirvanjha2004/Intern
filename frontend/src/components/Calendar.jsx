import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

function EventCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEvents(response.data.map(event => ({
        ...event,
        start: new Date(event.startTime),
        end: new Date(event.endTime)
      })));
    } catch (error) {
      console.error('Error fetching events:', error.response ? error.response.data : error.message);
    }
  };

  const handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name');
    const description = window.prompt('New Event description');
    if (title) {
      const newEvent = { title,description, startTime: start, endTime: end };
      createEvent(newEvent);
    }
  };

  const createEvent = async (newEvent) => {
    try {
      await axios.post('http://localhost:5000/events', newEvent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const updateEvent = async (updatedEvent) => {
    try {
      await axios.put(`http://localhost:5000/events/${updatedEvent.id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventSelect = (event) => {
    const action = window.prompt('Enter "edit" to update, "delete" to remove, or "cancel" to go back');
    if (action === 'edit') {
      const newTitle = window.prompt('Enter new title', event.title);
      const newDescription = window.prompt('Enter new description', event.description);
      if (newTitle || newDescription) {
        updateEvent({ ...event, title: newTitle || event.title, description: newDescription || event.description });
      }
    } else if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this event?')) {
        deleteEvent(event.id);
      }
    }
  };

  return (
    <div style={{ height: '600px', padding: '1rem' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventSelect}
        components={{
          event: ({ event }) => (
            <div>
              <strong>{event.title}</strong>
              {event.description && <p>{event.description}</p>}
            </div>
          ),
        }}
        style={{ height: '100%' }}
      />
    </div>
  );
}

export default EventCalendar;
