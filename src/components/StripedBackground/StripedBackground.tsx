interface StripedBackgroundProps {
  children: React.ReactNode
  className?: string
}

export default function StripedBackground({ children, className = '' }: StripedBackgroundProps) {
  return (
    <div 
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #e9e9e916 0%, #8bffa843 100%)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}
    >
      {/* Striped pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
