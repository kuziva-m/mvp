'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const shimmer = {
  hidden: { opacity: 0.3 },
  show: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse' as const,
      duration: 1,
    },
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function LoadingState() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    variants={shimmer}
                    className="w-12 h-12 rounded-xl bg-gray-200"
                  />
                  <motion.div
                    variants={shimmer}
                    className="w-16 h-6 rounded-full bg-gray-200"
                  />
                </div>
                <motion.div
                  variants={shimmer}
                  className="h-8 w-24 bg-gray-200 rounded mb-2"
                />
                <motion.div variants={shimmer} className="h-4 w-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kanban Skeleton */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <motion.div variants={shimmer} className="h-6 w-32 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-64">
                    <motion.div variants={shimmer} className="h-12 bg-gray-200 rounded-lg mb-2" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <motion.div
                          key={j}
                          variants={shimmer}
                          className="h-24 bg-gray-200 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Skeleton */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <motion.div variants={shimmer} className="h-6 w-32 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <motion.div variants={shimmer} className="w-2 h-2 rounded-full bg-gray-200 mt-2" />
                    <div className="flex-1 space-y-2">
                      <motion.div variants={shimmer} className="h-4 w-full bg-gray-200 rounded" />
                      <motion.div variants={shimmer} className="h-3 w-3/4 bg-gray-200 rounded" />
                      <motion.div variants={shimmer} className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <motion.div variants={shimmer} className="h-6 w-40 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <motion.div variants={shimmer} className="h-[300px] bg-gray-200 rounded-lg" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function TableLoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Search Skeleton */}
      <motion.div variants={shimmer} className="h-10 w-80 bg-gray-200 rounded-md" />

      {/* Table Skeleton */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50">
              {[1, 2, 3, 4].map((i) => (
                <motion.div key={i} variants={shimmer} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="grid grid-cols-4 gap-4 p-4"
              >
                {[1, 2, 3, 4].map((j) => (
                  <motion.div key={j} variants={shimmer} className="h-4 bg-gray-200 rounded" />
                ))}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <motion.div variants={shimmer} className="h-4 w-32 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <motion.div variants={shimmer} className="h-8 w-20 bg-gray-200 rounded" />
          <motion.div variants={shimmer} className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </motion.div>
  )
}
