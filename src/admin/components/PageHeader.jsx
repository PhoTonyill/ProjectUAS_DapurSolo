export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="admin-page-actions">{actions}</div>}
    </div>
  );
}
