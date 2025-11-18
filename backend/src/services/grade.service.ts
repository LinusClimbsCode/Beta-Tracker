import { prisma } from '#db'

export const createGrade = async (data: {
  gymId: string
  value: string
  displayOrder: number
}) => {
  // Check for duplicate value in same gym
  const existingValue = await prisma.grade.findUnique({
    where: {
      gymId_value: {
        gymId: data.gymId,
        value: data.value
      }
    }
  })
  if (existingValue) {
    throw new Error('Grade with this value already exists for this gym')
  }

  // Check for duplicate displayOrder in same gym
  const existingOrder = await prisma.grade.findUnique({
    where: {
      gymId_displayOrder: {
        gymId: data.gymId,
        displayOrder: data.displayOrder
      }
    }
  })
  if (existingOrder) {
    throw new Error('Display order already exists for this gym')
  }

  return await prisma.grade.create({
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

export const findGradeById = async (id: string) => {
  return await prisma.grade.findUnique({
    where: { id },
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

export const findAllGrades = async (filters: {
  gymId?: string
}) => {
  const where: any = {}

  if (filters.gymId) {
    where.gymId = filters.gymId
  }

  return await prisma.grade.findMany({
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
      displayOrder: 'asc'
    }
  })
}

export const updateGrade = async (id: string, data: {
  gymId?: string
  value?: string
  displayOrder?: number
}) => {
  // Get current grade to check constraints
  const currentGrade = await prisma.grade.findUnique({
    where: { id }
  })

  if (!currentGrade) {
    throw new Error('Grade not found')
  }

  const gymId = data.gymId || currentGrade.gymId

  // Check for duplicate value if updating value
  if (data.value) {
    const existingValue = await prisma.grade.findFirst({
      where: {
        gymId,
        value: data.value,
        NOT: { id }
      }
    })
    if (existingValue) {
      throw new Error('Grade with this value already exists for this gym')
    }
  }

  // Check for duplicate displayOrder if updating displayOrder
  if (data.displayOrder !== undefined) {
    const existingOrder = await prisma.grade.findFirst({
      where: {
        gymId,
        displayOrder: data.displayOrder,
        NOT: { id }
      }
    })
    if (existingOrder) {
      throw new Error('Display order already exists for this gym')
    }
  }

  return await prisma.grade.update({
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

export const deleteGrade = async (id: string) => {
  return await prisma.grade.delete({
    where: { id }
  })
}
