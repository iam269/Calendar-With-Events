document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const eventSelectedDate = document.getElementById('event-selected-date');
    const eventTitleInput = document.getElementById('event-title-input');
    const addEventBtn = document.getElementById('add-event-btn');
    const eventsList = document.getElementById('events-list');

    let currentDate = new Date();
    let selectedDate = null;
    const events = {}; // ex: { "2023-10-26": ["Meeting with team"] }

    const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYear.textContent = `${monthNames[month]} ${year}`;
        calendarDays.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Duminica, 1=Luni...
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Zilele din luna precedentă
        for (let i = firstDayOfMonth; i > 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.textContent = daysInPrevMonth - i + 1;
            dayElement.classList.add('inactive');
            calendarDays.appendChild(dayElement);
        }

        // Zilele din luna curentă
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            // Marcare zi curentă
            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            // Marcare zi selectată
            if (selectedDate && i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayElement.classList.add('selected');
            }

            // Adaugă punct dacă există eveniment
            if (events[dateStr]) {
                const eventDot = document.createElement('span');
                eventDot.classList.add('event-dot');
                dayElement.appendChild(eventDot);
            }

            dayElement.addEventListener('click', () => {
                selectedDate = new Date(year, month, i);
                eventSelectedDate.textContent = `Data: ${i} ${monthNames[month]} ${year}`;
                renderCalendar();
                renderEventsForDate(selectedDate);
            });

            calendarDays.appendChild(dayElement);
        }
    }

    function renderEventsForDate(date) {
        eventsList.innerHTML = '';
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        if (events[dateStr]) {
            events[dateStr].forEach(eventTitle => {
                const li = document.createElement('li');
                li.textContent = eventTitle;
                eventsList.appendChild(li);
            });
        } else {
            eventsList.innerHTML = '<li>Niciun eveniment pentru această zi.</li>';
        }
    }

    function addEvent() {
        if (!selectedDate) {
            alert('Te rog, selectează mai întâi o zi din calendar!');
            return;
        }
        const eventTitle = eventTitleInput.value.trim();
        if (eventTitle === '') {
            alert('Te rog, introdu un titlu pentru eveniment.');
            return;
        }

        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

        if (!events[dateStr]) {
            events[dateStr] = [];
        }

        events[dateStr].push(eventTitle);
        eventTitleInput.value = '';
        renderCalendar();
        renderEventsForDate(selectedDate);
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        // Dacă luna devine Decembrie, scade și anul
        if (currentDate.getMonth() === 11) {
            currentDate.setFullYear(currentDate.getFullYear());
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        // Dacă luna devine Ianuarie, crește și anul
        if (currentDate.getMonth() === 0) {
            currentDate.setFullYear(currentDate.getFullYear());
        }
        renderCalendar();
    });

    addEventBtn.addEventListener('click', addEvent);

    // Permite adăugarea evenimentului cu tasta Enter
    eventTitleInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            addEvent();
        }
    });

    // Inițializare
    renderCalendar();
});
