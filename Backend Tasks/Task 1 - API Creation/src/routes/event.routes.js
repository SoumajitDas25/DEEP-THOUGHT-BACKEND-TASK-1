import { Router } from "express";
import {
    createEvent,
    getEventById,
    getPaginatedEvents,
    updateEventById,
    deleteEventById
} from "../controllers/event.controller.js";
import { upload } from "../utils/fileUpload.js";

const router = Router();

router.route("/events")
.get(getEventById) //when client sends eventId in req query 
.get(getPaginatedEvents) //when client sends event type,page,limit in req query
.post(upload.array('files',10),createEvent);

router.route("/events/:id")
.put(upload.array('files',10),updateEventById)
.delete(deleteEventById);

export default router;