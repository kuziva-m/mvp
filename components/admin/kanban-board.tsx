'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KanbanItem {
  id: string
  title: string
  description?: string
  badge?: string
  metadata?: Record<string, any>
}

interface KanbanColumn {
  id: string
  title: string
  color: string
  items: KanbanItem[]
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onDragEnd: (result: DropResult) => void
  onItemClick?: (item: KanbanItem) => void
  renderItem?: (item: KanbanItem) => React.ReactNode
}

export function KanbanBoard({
  columns,
  onDragEnd,
  onItemClick,
  renderItem,
}: KanbanBoardProps) {
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null)

  const handleDragStart = (result: any) => {
    setDraggingItemId(result.draggableId)
  }

  const handleDragEnd = (result: DropResult) => {
    setDraggingItemId(null)
    onDragEnd(result)
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            {/* Column Header */}
            <div className={cn('rounded-lg p-3 mb-2', column.color)}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <Badge variant="secondary" className="bg-white/80">
                  {column.items.length}
                </Badge>
              </div>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'min-h-[400px] rounded-lg p-2 transition-colors',
                    snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-50'
                  )}
                >
                  <AnimatePresence mode="popLayout">
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card
                              className={cn(
                                'mb-2 cursor-move border-0 shadow-sm hover:shadow-md transition-all',
                                snapshot.isDragging && 'shadow-lg ring-2 ring-blue-400 rotate-2',
                                draggingItemId === item.id && 'opacity-50'
                              )}
                              onClick={() => onItemClick?.(item)}
                            >
                              <div className="p-4">
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex items-start gap-2 mb-2"
                                >
                                  <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    {renderItem ? (
                                      renderItem(item)
                                    ) : (
                                      <>
                                        <h4 className="font-medium text-gray-900 text-sm truncate">
                                          {item.title}
                                        </h4>
                                        {item.description && (
                                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                            {item.description}
                                          </p>
                                        )}
                                        {item.badge && (
                                          <Badge variant="outline" className="mt-2 text-xs">
                                            {item.badge}
                                          </Badge>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}

                  {/* Empty State */}
                  {column.items.length === 0 && !snapshot.isDraggingOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-32 text-sm text-gray-400"
                    >
                      Drop items here
                    </motion.div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
