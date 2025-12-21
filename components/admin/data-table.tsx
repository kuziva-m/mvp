<<<<<<< HEAD
"use client";
=======
'use client'
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
<<<<<<< HEAD
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
=======
} from '@tanstack/react-table'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
<<<<<<< HEAD
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  // New prop for filtering
  filterColumnName?: string;
=======
} from '@/components/ui/table'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
<<<<<<< HEAD
  searchPlaceholder = "Search...",
  filterColumnName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
=======
  searchPlaceholder = 'Search...',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
<<<<<<< HEAD
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn(searchKey)?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
          )}

          {/* Simple Filter Input for specific column (e.g. Source) */}
          {filterColumnName && table.getColumn(filterColumnName) && (
            <Input
              placeholder={`Filter ${filterColumnName}...`}
              value={
                (table
                  .getColumn(filterColumnName)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table
                  .getColumn(filterColumnName)
                  ?.setFilterValue(e.target.value)
              }
              className="max-w-[150px]"
            />
          )}
        </div>
      </div>
=======
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchKey && (
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      )}
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
<<<<<<< HEAD
                            ? "flex items-center gap-2 cursor-pointer select-none hover:text-gray-900"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
=======
                            ? 'flex items-center gap-2 cursor-pointer select-none hover:text-gray-900'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : header.column.getIsSorted() === 'desc' ? (
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronsUpDown className="w-4 h-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
<<<<<<< HEAD
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
=======
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
<<<<<<< HEAD
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
=======
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {table.getFilteredRowModel().rows.length} result(s)
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
}
