import { describe, expect, it } from 'vitest'

import {
  buildAvailabilityDraftCells,
  buildDateOptions,
  buildHalfHourTimeKeys,
  buildSlotBoard,
  getSlotById,
  getSlotsByIds,
  toLocalSlotIso,
  toDateKey,
  type SlotBoardCourse,
} from './slot-board'

const courses: SlotBoardCourse[] = [
  {
    id: 'course-1',
    title: 'Piano coaching',
    instrument: 'Piano',
    level: 'Intermediate',
    location: 'Studio A',
    profiles: { full_name: 'Ada Member' },
    course_slots: [
      {
        id: 'slot-1',
        starts_at: new Date(2026, 6, 4, 10, 0).toISOString(),
        ends_at: new Date(2026, 6, 4, 10, 30).toISOString(),
        status: 'available',
      },
      {
        id: 'slot-2',
        starts_at: new Date(2026, 6, 4, 10, 30).toISOString(),
        ends_at: new Date(2026, 6, 4, 11, 0).toISOString(),
        status: 'booked',
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Violin lesson',
    instrument: 'Violin',
    level: 'All levels',
    location: 'Room B',
    profiles: { full_name: 'Grace Member' },
    course_slots: [
      {
        id: 'slot-3',
        starts_at: new Date(2026, 6, 5, 10, 0).toISOString(),
        ends_at: new Date(2026, 6, 5, 10, 30).toISOString(),
        status: 'available',
      },
    ],
  },
]

describe('slot-board helpers', () => {
  it('formats stable local date keys', () => {
    expect(toDateKey(new Date('2026-07-04T12:00:00'))).toBe('2026-07-04')
  })

  it('builds a seven day date option strip', () => {
    const options = buildDateOptions('2026-07-04', 4)

    expect(options.map((option) => option.key)).toEqual([
      '2026-07-04',
      '2026-07-05',
      '2026-07-06',
      '2026-07-07',
    ])
    expect(options[0]?.label).toBeTruthy()
  })

  it('builds date-specific course rows and time columns', () => {
    const board = buildSlotBoard(courses, '2026-07-04')

    expect(board.timeColumns.map((column) => column.timeKey)).toEqual(['10:00', '10:30'])
    expect(board.rows).toHaveLength(1)
    expect(board.rows[0]?.course.title).toBe('Piano coaching')
    expect(board.rows[0]?.cells.map((cell) => cell.slot?.id ?? null)).toEqual(['slot-1', 'slot-2'])
  })

  it('returns empty rows when the selected date has no slots', () => {
    const board = buildSlotBoard(courses, '2026-07-06')

    expect(board.timeColumns).toEqual([])
    expect(board.rows).toEqual([])
  })

  it('finds a selected slot by id', () => {
    expect(getSlotById(courses, 'slot-3')?.course.title).toBe('Violin lesson')
    expect(getSlotById(courses, 'missing')).toBeUndefined()
  })

  it('finds multiple selected slots by ids', () => {
    expect(getSlotsByIds(courses, ['slot-3', 'slot-1']).map((item) => item.slot.id)).toEqual([
      'slot-3',
      'slot-1',
    ])
  })

  it('builds half-hour time keys for an availability picker', () => {
    expect(buildHalfHourTimeKeys(9, 11)).toEqual(['09:00', '09:30', '10:00', '10:30'])
  })

  it('converts a date key and time key into a local slot ISO string', () => {
    const iso = toLocalSlotIso('2026-07-04', '10:30')

    expect(new Date(iso).getFullYear()).toBe(2026)
    expect(new Date(iso).getMonth()).toBe(6)
    expect(new Date(iso).getDate()).toBe(4)
    expect(new Date(iso).getHours()).toBe(10)
    expect(new Date(iso).getMinutes()).toBe(30)
  })

  it('marks existing and selected availability picker cells', () => {
    const cells = buildAvailabilityDraftCells({
      dateKey: '2026-07-04',
      existingSlots: courses[0]?.course_slots ?? [],
      selectedTimeKeys: ['11:00'],
      startHour: 10,
      endHour: 12,
    })

    expect(cells.map((cell) => [cell.timeKey, cell.status])).toEqual([
      ['10:00', 'available'],
      ['10:30', 'booked'],
      ['11:00', 'selected'],
      ['11:30', 'empty'],
    ])
    expect(cells.find((cell) => cell.timeKey === '10:00')?.selectable).toBe(false)
    expect(cells.find((cell) => cell.timeKey === '11:30')?.selectable).toBe(true)
  })
})
