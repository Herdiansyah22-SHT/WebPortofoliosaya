export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-card border border-navy-700 bg-navy-800 shadow-soft transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}