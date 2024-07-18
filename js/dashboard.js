import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDSUTtON3EZKPfdZR0qRaygngWEes-K9fs",
    authDomain: "barbertime-49a58.firebaseapp.com",
    projectId: "barbertime-49a58",
    storageBucket: "barbertime-49a58.appspot.com",
    messagingSenderId: "64092814528",
    appId: "1:64092814528:web:a8bd44924e54e6cef68125"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    const reservationsTableBody = document.getElementById('reservationsTableBody');
    const editForm = document.getElementById('editForm');
    const editErrorMessage = document.getElementById('editErrorMessage');
    const editSuccessMessage = document.getElementById('editSuccessMessage');
    let currentEditReservationId = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchReservations();
            const userEmail = user.email;
            document.getElementById('userEmail').textContent = userEmail;
        } else {
            window.location.href = "admin.html";
        }
    });

    logoutButton.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = "admin.html";
    });

    async function fetchReservations() {
        reservationsTableBody.innerHTML = ''; // Clear existing table rows
        try {
            const querySnapshot = await getDocs(collection(db, 'reservations'));
            querySnapshot.forEach((doc) => {
                const reservation = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reservation.name}</td>
                    <td>${reservation.phone}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.time}</td>
                    <td>
                        <button class="btn btn-sm btn-light edit-btn" data-id="${doc.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                reservationsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching reservations: ', error);
        }
    }

    // Event listener for edit and delete buttons
    document.addEventListener('click', async (event) => {
        if (event.target.closest('.edit-btn')) {
            const reservationId = event.target.closest('.edit-btn').getAttribute('data-id');
            const reservationRef = doc(db, 'reservations', reservationId);
            const docSnapshot = await getDoc(reservationRef);

            if (docSnapshot.exists()) {
                const reservationData = docSnapshot.data();
                currentEditReservationId = reservationId;

                // Assuming you have an edit modal with id="editModal" and relevant form fields
                const editModal = new bootstrap.Modal(document.getElementById('editModal'));
                editForm.name.value = reservationData.name;
                editForm.phone.value = reservationData.phone;
                editForm.date.value = reservationData.date;
                editForm.time.value = reservationData.time;

                editModal.show();
            }
        }

        if (event.target.closest('.delete-btn')) {
            const reservationId = event.target.closest('.delete-btn').getAttribute('data-id');
            try {
                await deleteDoc(doc(db, 'reservations', reservationId));
                console.log('Document successfully deleted');
                // Optionally, remove the row from the table
                event.target.closest('tr').remove();
            } catch (error) {
                console.error('Error deleting document: ', error);
            }
        }
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newName = editForm.name.value;
        const newPhone = editForm.phone.value;
        const newDate = editForm.date.value;
        const newTime = editForm.time.value;

        // Check if the selected date and time are in the past
        const selectedDateTime = new Date(`${newDate}T${newTime}`);
        const currentDateTime = new Date();
        if (selectedDateTime <= currentDateTime) {
            editErrorMessage.textContent = 'Reservations cannot be in the past.';
            return;
        }

        // Check if the selected time is at least 30 minutes ahead of the current time
        const minimumTime = new Date(currentDateTime.getTime() + 30 * 60000); // 30 minutes in milliseconds
        if (selectedDateTime < minimumTime) {
            editErrorMessage.textContent = 'Please select a time at least 30 minutes ahead of the current time.';
            return;
        }

        // Check if the selected date is a Monday (getDay() returns 1 for Monday)
        if (selectedDateTime.getDay() === 1) {
            editErrorMessage.textContent = 'Reservations cannot be made on Mondays. Please select another date.';
            return;
        }

        try {
            const reservationRef = doc(db, 'reservations', currentEditReservationId);
            await updateDoc(reservationRef, {
                name: newName,
                phone: newPhone,
                date: newDate,
                time: newTime
            });
            editSuccessMessage.textContent = 'Reservation successfully updated.';
            setTimeout(() => {
                editSuccessMessage.textContent = '';
                const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                editModal.hide();
                fetchReservations();
            }, 3000);
        } catch (error) {
            console.error('Error updating document: ', error);
            editErrorMessage.textContent = 'Failed to update reservation.';
        }
    });
});

(function ($) {
    "use strict";

    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });

    // Calendar
    $('#calendar').datetimepicker({
        inline: true,
        format: 'L'
    });

})(jQuery);
