import DataTable from '@/components/data-display/DataTable/DataTable'
import i18n from '@/i18n'

export default function RolesPermissionsMatrixCard({
  title,
  headerAction,
  columns,
  data,
  emptyMessage,
  loading = false,
  showActions = false,
  actions = [],
  actionHeader = i18n.t('ui.action'),
  actionType = 'menu',
  getRowKey,
}) {
  return (
    <section className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[var(--primary-text)] sm:text-lg">
          {title}
        </h2>
        {headerAction}
      </div>
      <DataTable
        showCard={false}
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage={emptyMessage}
        showActions={showActions}
        actions={actions}
        actionHeader={actionHeader}
        actionType={actionType}
        getRowKey={getRowKey}
        className="[&_table]:min-w-0 [&_table]:w-full"
      />
    </section>
  )
}
