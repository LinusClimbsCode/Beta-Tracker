import { prisma } from '#db'
import type { GradeSystemType } from '#db'

export const createGym = async (data: {
  name: string
  address: object
  city: string
  website: string
  phone: string
  email: string
  openingHours: object
  description: string
  priceInfo: object
  imageUrl: string
  gradeSystemType: GradeSystemType
  isActive: boolean
}) => {
  return await prisma.gym.create({
    data
  })
}

export const findGymById = async (id: string) => {
  return await prisma.gym.findUnique({
    where: { id },
    include: {
      walls: true,
      moderators: true
    }
  })
}

export const findAllGyms = async () => {
  return await prisma.gym.findMany({
    include: {
      moderators: {
        select: {
          moderator: {
            select: { id: true, username: true }
          }
        }
      }
    }
  })
}

export const updateGym = async (id: string, data: { name?: string; city?: string; address?: string }) => {
  return await prisma.gym.update({
    where: { id },
    data
  })
}

export const deleteGym = async (id: string) => {
  return await prisma.gym.delete({
    where: { id }
  })
}
