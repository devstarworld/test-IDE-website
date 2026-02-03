'use client'

export default function FeaturesSection() {
  const features = [
    {
      id: 'card-keep-pace',
      title: 'Your Rules, in Code',
      description: 'What your staff engineers catch, now everyone catches. Define your standards as rules in your repo—version-controlled, reviewable, and always enforced.',
      scale: 1,
      zIndex: 10
    },
    {
      id: 'card-raise-the-bar',
      title: 'Silent Until It Matters',
      description: 'Not every PR needs a mermaid diagram. Continue only speaks up when something is wrong (and actually gives you the fix).',
      scale: 1.05,
      zIndex: 20
    },
    {
      id: 'card-ship-confidently',
      title: 'Review with a Real Agent',
      description: 'Full access to your codebase and MCP tools—not just the diff. See the agent\'s logs, interact with it for debugging, and follow up like you would with your CLI coding agent.',
      scale: 1,
      zIndex: 10
    }
  ]

  return (
    <section className="py-24 section-animate" style={{opacity: 0, filter: 'blur(12px)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Run agents on every PR</h2>
        
        <div className="grid md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative rounded-xl border border-border/50 overflow-hidden p-8"
              data-line-element-id={feature.id}
              style={{
                zIndex: feature.zIndex,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
                transform: `translateY(0) scale(${feature.scale})`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out'
              }}
            >
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
              
              <div className="relative">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}