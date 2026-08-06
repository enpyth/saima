import type { CourseWithSlots, SlotStatus } from '@saima/shared'

export type SlotBoardSlot = {
  id: string
  startsAt: string
  endsAt: string
  status: SlotStatus
}

export type SlotBoardCourse = Pick<CourseWithSlots, 'id' | 'title' | 'instrument' | 'level' | 'location' | 'profile'> & {
  courseSlots: SlotBoardSlot[]
}

export type SlotBoardCell = {
  timeKey: string
  slot?: SlotBoardSlot
}

export type AvailabilityDraftCell = {
  timeKey: string
  status: 'empty' | 'selected' | SlotStatus
  selectable: boolean
  slot?: SlotBoardSlot
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatDateOptionLabel(date: Date) {
  const day = `${date.getDate()}`.padStart(2, '0')
  const month = `${date.getMonth() + 1}`.padStart(2, '0')

  return `${weekdays[date.getDay()]} ${day}/${month}`
}

export function formatSlotDateTime(value: string) {
  const date = new Date(value)
  const day = `${date.getDate()}`.padStart(2, '0')
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const year = date.getFullYear()
  const time = formatSlotTime(date)

  return `${day}/${month}/${year} ${time}`
}

function formatSlotTime(date: Date) {
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')

  return `${hours}:${minutes}`
}

function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function buildDateOptions(startDateKey: string, count = 7) {
  const start = fromDateKey(startDateKey)

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const key = toDateKey(date)

    return {
      key,
      label: formatDateOptionLabel(date),
    }
  })
}

export function getSlotDateKey(slot: Pick<SlotBoardSlot, 'startsAt'>) {
  return toDateKey(new Date(slot.startsAt))
}

export function getSlotTimeKey(slot: Pick<SlotBoardSlot, 'startsAt'>) {
  return formatSlotTime(new Date(slot.startsAt))
}

export function buildHalfHourTimeKeys(startHour = 8, endHour = 22) {
  const timeKeys: string[] = []

  for (let hour = startHour; hour < endHour; hour += 1) {
    timeKeys.push(`${hour}`.padStart(2, '0') + ':00')
    timeKeys.push(`${hour}`.padStart(2, '0') + ':30')
  }

  return timeKeys
}

export function toLocalSlotIso(dateKey: string, timeKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const [hour, minute] = timeKey.split(':').map(Number)

  return new Date(
    year ?? 1970,
    (month ?? 1) - 1,
    day ?? 1,
    hour ?? 0,
    minute ?? 0,
  ).toISOString()
}

export function buildAvailabilityDraftCells({
  dateKey,
  existingSlots,
  selectedTimeKeys,
  startHour = 8,
  endHour = 22,
}: {
  dateKey: string
  existingSlots: SlotBoardSlot[]
  selectedTimeKeys: string[]
  startHour?: number
  endHour?: number
}) {
  const slotsForDate = existingSlots.filter((slot) => getSlotDateKey(slot) === dateKey)
  const selected = new Set(selectedTimeKeys)

  return buildHalfHourTimeKeys(startHour, endHour).map<AvailabilityDraftCell>((timeKey) => {
    const slot = slotsForDate.find((slot) => getSlotTimeKey(slot) === timeKey)
    if (slot) {
      return {
        timeKey,
        status: slot.status,
        selectable: false,
        slot,
      }
    }

    return {
      timeKey,
      status: selected.has(timeKey) ? 'selected' : 'empty',
      selectable: true,
    }
  })
}

export function buildSlotBoard(courses: SlotBoardCourse[], dateKey: string) {
  const rowsWithSlots = courses
    .map((course) => ({
      course,
      slots: course.courseSlots.filter((slot) => getSlotDateKey(slot) === dateKey),
    }))
    .filter((row) => row.slots.length > 0)

  const timeKeys = Array.from(
    new Set(
      rowsWithSlots.flatMap((row) => row.slots.map((slot) => getSlotTimeKey(slot))),
    ),
  ).sort()

  return {
    timeColumns: timeKeys.map((timeKey) => ({ timeKey })),
    rows: rowsWithSlots.map((row) => ({
      course: row.course,
      cells: timeKeys.map<SlotBoardCell>((timeKey) => ({
        timeKey,
        slot: row.slots.find((slot) => getSlotTimeKey(slot) === timeKey),
      })),
    })),
  }
}

export function getSlotById(courses: SlotBoardCourse[], slotId: string) {
  for (const course of courses) {
    const slot = course.courseSlots.find((slot) => slot.id === slotId)
    if (slot) {
      return { course, slot }
    }
  }

  return undefined
}

export function getSlotsByIds(courses: SlotBoardCourse[], slotIds: string[]) {
  return slotIds.flatMap((slotId) => {
    const selected = getSlotById(courses, slotId)
    return selected ? [selected] : []
  })
}
