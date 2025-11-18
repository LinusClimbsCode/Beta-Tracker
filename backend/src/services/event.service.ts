import { prisma } from '#db'
import type { EventType } from '#db'

export const createEvent = async (data: {
  gymId: string
  title: string
  eventType: EventType[]
  description: string
  imageUrl?: string
  startTime: string
  endTime: string
  price: string
  registrationLink: string
  isActive: boolean
}) => {
  return await prisma.event.create({
    data,
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          city: true
        }
      }
    }
  })
}

export const findEventById = async (id: string) => {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          city: true,
          address: true
        }
      }
    }
  })
}

export const findAllEvents = async (filters: {
  gymId?: string
  city?: string
  isActive?: boolean
}) => {
  const where: any = {}

  if (filters.gymId) {
    where.gymId = filters.gymId
  }

  if (filters.city) {
    where.gym = {
      city: filters.city
    }
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive
  }

  return await prisma.event.findMany({
    where,
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          city: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const updateEvent = async (id: string, data: {
  gymId?: string
  title?: string
  eventType?: EventType[]
  description?: string
  imageUrl?: string
  startTime?: string
  endTime?: string
  price?: string
  registrationLink?: string
  isActive?: boolean
}) => {
  return await prisma.event.update({
    where: { id },
    data,
    include: {
      gym: {
        select: {
          id: true,
          name: true,
          city: true
        }
      }
    }
  })
}

export const deleteEvent = async (id: string) => {
  return await prisma.event.delete({
    where: { id }
  })
}
