document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservationForm');
    const customerName = document.getElementById('customerName');
    const reservationDate = document.getElementById('reservationDate');
    const reservationTime = document.getElementById('reservationTime');
    const errorMessage = document.getElementById('errorMessage');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const name = form.name.value;
        const phone = form.phone.value;
        const date = form.date.value;
        const time = form.time.value;

        // Check if the selected date and time are in the past
        const selectedDateTime = new Date(`${date}T${time}`);
        const currentDateTime = new Date();
        if (selectedDateTime <= currentDateTime) {
            errorMessage.textContent = 'Reservations cannot be in the past.';
            errorModal.show();
            return; // Prevent form submission
        }

        // Check if the selected time is at least 30 minutes ahead of the current time
        const minimumTime = new Date(currentDateTime.getTime() + 30 * 60000); // 30 minutes in milliseconds
        if (selectedDateTime < minimumTime) {
            errorMessage.textContent = 'Please select a time at least 30 minutes ahead of the current time.';
            errorModal.show();
            return; // Prevent form submission
        }

        // Check if the selected date is a Monday (getDay() returns 1 for Monday)
        if (selectedDateTime.getDay() === 1) {
            errorMessage.textContent = 'Reservations cannot be made on Mondays. Please select another date.';
            errorModal.show();
            return; // Prevent form submission
        }

        // Send email using EmailJS
        emailjs.send('service_v6gkffi', 'template_gf9np6k', {
            to_name: 'Barber',
            from_name: name,
            customer_phone: phone,
            reservation_date: date,
            reservation_time: time
        }).then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            // Show confirmation modal
            customerName.textContent = name;
            reservationDate.textContent = date;
            reservationTime.textContent = time;
            confirmationModal.show();
        }).catch((error) => {
            console.error('FAILED...', error);
            errorMessage.textContent = 'Failed to submit reservation. Please try again later.';
            errorModal.show();
        });

        // Reset form after submission (if needed)
        form.reset();
    });
});
