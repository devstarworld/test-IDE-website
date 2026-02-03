'use client'

export default function VideoSection() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 section-animate" style={{opacity: 0, filter: 'blur(12px)'}}>
      <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50">
        <div 
          style={{
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem'
          }}
        />
      </div>
    </section>
  )
}