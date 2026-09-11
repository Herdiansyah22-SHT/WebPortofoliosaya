import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Async } from '../../components/common/Async'
import {
  Button,
  DataTable,
  EmptyState,
  Input,
  Pagination,
  Select,
  Skeleton,
} from '../../components/ui'

/**
 * Halaman list generik untuk CMS.
 * queryFn: (params) => promise hasil adminApi (res.data.items = array, res.data.meta = pagination).
 * columns: [{ key, header, render(item) }]
 */
export default function ResourcePage({
  title,
  description,
  queryFn,
  queryKey,
  columns,
  rowKey = 'id',
  searchPlaceholder = 'Cari…',
  filters,
  actions,
  noPagination = false,
  emptyBody,
  primaryLabel,
  onPrimaryAction,
  onEdit,
  onDelete,
}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleFilter = (value) => {
    setFilter(value)
    setPage(1)
  }

  const activeFilter = filters?.find((f) => f.value === filter)
  const params = {
    page,
    per_page: 10,
    ...(debounced && { search: debounced }),
    ...(activeFilter?.paramKey && filter ? { [activeFilter.paramKey]: filter } : {}),
    ...(!activeFilter?.paramKey && filter ? { status: filter } : {}),
  }

  const query = useResourceQuery(queryKey, queryFn, params)

  const items = query.data?.data ?? []
  const meta = query.data?.meta ?? {}

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-700">{description}</p>}
        </div>
        {primaryLabel && onPrimaryAction && (
          <Button onClick={onPrimaryAction}> {primaryLabel}</Button>
        )}
      </div>

      {(searchPlaceholder || filters?.length) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <Input
            name={`search-${queryKey}`}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          {filters?.length > 0 && (
            <Select name={`filter-${queryKey}`} value={filter} onChange={(e) => handleFilter(e.target.value)} className="sm:w-40">
              <option value="">Semua status</option>
              {filters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          )}
        </div>
      )}

      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        isEmpty={!items.length}
        emptyTitle={`Belum ada ${title.toLowerCase()}.`}
        empty={
          emptyBody || <EmptyState title={`Belum ada ${title.toLowerCase()}.`} description="Data belum tersedia." />
        }
        loading={<Skeleton className="h-64 w-full" />}
      >
        {() => (
          <DataTable
            columns={columns}
            items={items}
            rowKey={rowKey}
            actions={(item) => (
              <div className="flex justify-end gap-2">
                {actions && actions(item)}
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>Edit</Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(item)}>Hapus</Button>
                )}
              </div>
            )}
            empty={null}
          />
        )}
      </Async>

      {!noPagination && meta.last_page > 1 && (
        <Pagination
          page={meta.current_page}
          lastPage={meta.last_page}
          onChange={setPage}
          className="mt-6"
        />
      )}
    </div>
  )
}

function useResourceQuery(queryKey, queryFn, params) {
  return useQuery({ queryKey: [queryKey, params], queryFn: () => queryFn(params) })
}