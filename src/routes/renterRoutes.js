// // Scenario: User Renting a Charger


// 2. View Available Chargers:
// - Route: `GET /api/chargers`
// - Description: The user can retrieve a list of all available chargers on the website. The response will contain information about each charger, such as ID, type, status, price, and owner details.

// 3. View Charger Details: (Done in v2)
// - Route: `GET /api/chargers/:id`
// - Description: The user can view detailed information about a specific charger by providing its ID in the route.

// 4. Check Charger Availability:
// - Route: `GET /api/chargers/:id/availability`
// - Description: The user can check if a specific charger is available for rent during their desired timeframe. The request may include the start and end time of the rental period.

// 5. Create Reservation:(Done)
// - Route: `POST /api/reservations`
// - Description: The user can create a new reservation for a charger. The request should include the charger ID, start time, end time, and any other necessary details.

// 6. View User's Reservations:
// - Route: `GET /api/reservations/user/:id`
// - Description: The user can view their own reservations to keep track of upcoming and past rentals.

// 7. Update Reservation: (done)
// - Route: `PUT /api/reservations/:id`
// - Description: The user can update an existing reservation, for example, to extend the end time or modify other details.

// 8. Cancel Reservation:(Done)
// - Route: `DELETE /api/reservations/:id`
// - Description: The user can cancel a reservation if they no longer need to rent the charger.

// 9. Leave a Review for Charger Owner:(done)
// - Route: `POST /api/reviews`
// - Description: After completing a rental, the user can leave a review and rating for the charger owner. The request should include the target charger owner's ID, rating, and comments.

// 10. View Charger Owner's Reviews:
//  - Route: `GET /api/users/:id/reviews`
//  - Description: The user can view reviews written by other users about the charger owner.



'use strict';

const express = require('express');
const dataModules = require('../models');

const router = express.Router();

const basicAuth = require('../middleware/basic.js')
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')


// i will add the middlewares to the route later 

// View Available Chargers:
// - Route: `GET /api/chargers`
// - Description: The user can retrieve a list of all available chargers on the website. The response will contain information about each charger, such as ID, type, status, price, and owner details.

router.get('/availableChargers',handleAvailableChargers);

// Check Charger Availability:
// - Route: `GET /api/chargers/:id/availability`
// - Description: The user can check if a specific charger is available for rent during their desired timeframe. The request may include the start and end time of the rental period.

router.get('/chargers/:id/availability',handleCheckChargerAvailability);

// View User's Reservations:
// - Route: `GET /api/reservations/user/:id`
// - Description: The user can view their own reservations to keep track of upcoming and past rentals.


router.get('/reservations/user/:id',handleGetUserReservations);

// View Charger Owner's Reviews:
//  - Route: `GET /api/users/:id/reviews`
//  - Description: The user can view reviews written by other users about the charger owner.

router.get('/users/:id/reviews',handleGetOwnerReviews);






// handlers
async function handleAvailableChargers(req, res, next) {
    try {
        const availableChargers = await dataModules.originalCharger.findAll({ where: { status: 'available' } });
        res.status(200).json(availableChargers);
    } catch (e) {
        next(e.message)
    }
}   

async function handleCheckChargerAvailability(req, res, next) {
    try {
        const chargerId = req.params.id;
        const charger = await dataModules.originalCharger.findOne({ where: { id: chargerId } });
        if (charger.status === 'available') {
            res.status(200).json({ available: true });
        } else {
            res.status(200).json({ available: false });
        }
    } catch (e) {
        next(e.message)
    }
}

async function handleGetUserReservations(req, res, next) {
    try {
        const userId = req.params.id;
        const userReservations = await dataModules.originalReservation.findAll({ where: { userId: userId } });
        res.status(200).json(userReservations);
    } catch (e) {
        next(e.message)
    }
}

async function handleGetOwnerReviews(req, res, next) {
    try {
        const ownerId = req.params.id;
        const ownerReviews = await dataModules.originalReviews.findAll({ where: { targetId: ownerId } });
        res.status(200).json(ownerReviews);
    } catch (e) {
        next(e.message)
    }
}


module.exports = router;





















