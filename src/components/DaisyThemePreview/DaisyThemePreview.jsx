import React from 'react'

function DaisyThemePreview() {
  return (
    <div className="bg-neutral text-base-content min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">Night Theme Preview 🌙</h1>
          <p className="text-lg opacity-70">
            Showing DaisyUI components styled with the{' '}
            <code className="bg-base-200 rounded px-2 py-1">night</code> theme.
          </p>
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-accent">Accent</button>
            <button className="btn btn-info">Info</button>
            <button className="btn btn-success">Success</button>
            <button className="btn btn-warning">Warning</button>
            <button className="btn btn-error">Error</button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Base Card</h3>
                <p>
                  Uses <code>bg-base-200</code> background and theme text.
                </p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm">Action</button>
                </div>
              </div>
            </div>
            <div className="card bg-neutral text-neutral-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Neutral Card</h3>
                <p>Good for darker accent sections.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-secondary btn-sm">Explore</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Alerts</h2>
          <div className="space-y-2">
            <div className="alert alert-info">This is an info alert</div>
            <div className="alert alert-success">This is a success alert</div>
            <div className="alert alert-warning">This is a warning alert</div>
            <div className="alert alert-error">This is an error alert</div>
          </div>
        </section>

        {/* Inputs & Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Inputs & Badges</h2>
          <div className="flex max-w-sm flex-col gap-4">
            <input type="text" placeholder="Type here..." className="input input-bordered w-full" />
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">Primary</span>
              <span className="badge badge-secondary">Secondary</span>
              <span className="badge badge-accent">Accent</span>
              <span className="badge badge-info">Info</span>
              <span className="badge badge-success">Success</span>
              <span className="badge badge-warning">Warning</span>
              <span className="badge badge-error">Error</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DaisyThemePreview
