import { Router } from 'express'
import {
  createEventController,
  getEventController,
  getAllEventsController,
  updateEventController,
  deleteEventController
} from '#controllers'
import { requireAuth, validateCreateEvent, validateUpdateEvent } from '#middleware'

export const eventRouter = Router()

// Public
eventRouter.get('/', getAllEventsController)
eventRouter.get('/:id', getEventController)

// Protected (all authenticated users can create/update/delete)
eventRouter.post('/', requireAuth, validateCreateEvent, createEventController)
eventRouter.patch('/:id', requireAuth, validateUpdateEvent, updateEventController)
eventRouter.delete('/:id', requireAuth, deleteEventController)
