import type { CSSProperties } from 'react'
import { CalendarDays } from 'lucide-react'

import { Button } from './ui/button'
import {
  buildDateOptions,
  buildSlotBoard,
  formatSlotDateTime,
  getSlotsByIds,
  toDateKey,
  type SlotBoardCourse,
} from '../lib/slot-board'

type CourseSlotBoardProps = {
  courses: SlotBoardCourse[]
  selectedDateKey: string
  selectedSlotIds?: string[]
  onDateChange: (dateKey: string) => void
  onSlotToggle?: (slotId: string) => void
  onConfirm?: () => void
  mode: 'booking' | 'admin'
  confirmLabel?: string
}

function formatSelection(courses: SlotBoardCourse[], slotIds: string[]) {
  if (slotIds.length === 0) {
    return undefined
  }

  const selected = getSlotsByIds(courses, slotIds)
  if (selected.length === 0) {
    return undefined
  }

  if (selected.length === 1 && selected[0]) {
    return `${selected[0].course.title} · ${formatSlotDateTime(selected[0].slot.startsAt)}`
  }

  return `${selected.length} slots selected`
}

export function CourseSlotBoard({
  courses,
  selectedDateKey,
  selectedSlotIds = [],
  onDateChange,
  onSlotToggle,
  onConfirm,
  mode,
  confirmLabel = 'Confirm booking',
}: CourseSlotBoardProps) {
  const board = buildSlotBoard(courses, selectedDateKey)
  const todayKey = toDateKey(new Date())
  const dates = buildDateOptions(todayKey, 7)
  const selectionLabel = formatSelection(courses, selectedSlotIds)
  const readonly = mode === 'admin'

  return (
    <div className="slot-board">
      <div className="date-jump">
        <CalendarDays aria-hidden="true" size={18} />
        <input
          aria-label="Choose booking date"
          type="date"
          value={selectedDateKey}
          onChange={(event) => onDateChange(event.currentTarget.value)}
        />
      </div>
      <div className="slot-date-strip" aria-label="Select booking date">
        {dates.map((date) => (
          <Button
            key={date.key}
            type="button"
            size="sm"
            variant={selectedDateKey === date.key ? 'default' : 'outline'}
            onClick={() => onDateChange(date.key)}
          >
            {date.key === todayKey ? 'Today' : date.label}
          </Button>
        ))}
      </div>

      {board.timeColumns.length === 0 ? (
        <div className="empty-state">
          <strong>No slots on this date.</strong>
          <p className="muted">Choose another date to view available course times.</p>
        </div>
      ) : (
        <div className="slot-board-scroll">
          <div
            className="slot-board-grid"
            style={{ '--slot-columns': board.timeColumns.length } as CSSProperties}
          >
            <div className="slot-board-corner" />
            {board.timeColumns.map((column) => (
              <div className="slot-board-time" key={column.timeKey}>
                {column.timeKey}
              </div>
            ))}
            {board.rows.map((row) => (
              <div className="slot-board-row" key={row.course.id}>
                <div className="slot-board-course">
                  <strong>{row.course.title}</strong>
                  <span>
                    {row.course.profile?.fullName ?? 'SAIMA member'} · {row.course.location}
                  </span>
                </div>
                {row.cells.map((cell) => {
                  const status = cell.slot?.status ?? 'empty'
                  const selectable = !readonly && cell.slot?.status === 'available'
                  const selected = cell.slot ? selectedSlotIds.includes(cell.slot.id) : false

                  return (
                    <button
                      key={`${row.course.id}-${cell.timeKey}`}
                      type="button"
                      className={`slot-square ${status}${selected ? ' selected' : ''}`}
                      aria-label={
                        cell.slot
                          ? `${row.course.title} ${cell.timeKey} ${status}`
                          : `${row.course.title} ${cell.timeKey} unavailable`
                      }
                      disabled={!selectable}
                      onClick={() => {
                        if (cell.slot && selectable) {
                          onSlotToggle?.(cell.slot.id)
                        }
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="slot-board-footer">
        <div className="slot-legend" aria-label="Slot status legend">
          <span>
            <i className="slot-swatch available" /> Available
          </span>
          <span>
            <i className="slot-swatch booked" /> Booked
          </span>
          {!readonly ? (
            <span>
              <i className="slot-swatch selected" /> Selected
            </span>
          ) : null}
        </div>
        {!readonly ? (
          <div className="slot-confirm">
            <span className="muted">{selectionLabel ?? 'Select a slot to continue.'}</span>
            <Button type="button" disabled={selectedSlotIds.length === 0} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
