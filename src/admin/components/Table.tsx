import '../styles/Table.css';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends { id?: string; _id?: string }>({
  columns,
  data,
  actions,
  loading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  const getId = (item: T) => (item.id || item._id) as string;

  if (loading) {
    return <div className="table-loading">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={getId(item)}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render 
                    ? col.render(item[col.key], item)
                    : String(item[col.key])
                  }
                </td>
              ))}
              {actions && (
                <td className="table-actions">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
