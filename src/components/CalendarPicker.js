import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form } from 'react-bootstrap';

function CalendarPicker({ onDateChange, bookedDates = [] }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Kthejmë datat e rezervuara në formatin që kërkon DatePicker
  const excludeIntervals = bookedDates.map(range => ({
    start: new Date(range.data_hyrjes),
    end: new Date(range.data_daljes)
  }));

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      const diffTime = Math.abs(end - start);
      const netet = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      onDateChange({
        start: start,
        end: end,
        netet: netet
      });
    } else {
      onDateChange(null);
    }
  };

  return (
    <div className="calendar-wrapper">
      <Form.Label className="fw-bold small mb-2 text-uppercase text-muted">
        Zgjidhni Datat (Datat në gri janë të zëna)
      </Form.Label>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        minDate={new Date()}
        excludeDateIntervals={excludeIntervals} // Ky rresht bllokon datat e zëna
      />
    </div>
  );
}

export default CalendarPicker;