import React from 'react';

function ThemePreview() {
  return (
    <div className="p-8 space-y-6 bg-background text-foreground rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">Theme Color Showcase</h2>
      <p className="text-muted-foreground">
        This component displays the theme colors and their
        application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-md bg-primary text-primary-foreground flex flex-col justify-center">
          <h3 className="text-xl font-semibold">Primary Color</h3>
          <p>Used for primary actions and key elements.</p>
        </div>

        <div className="p-6 rounded-md bg-secondary text-secondary-foreground flex flex-col justify-center">
          <h3 className="text-xl font-semibold">Secondary Color</h3>
          <p>
            Used for secondary actions and less emphasized elements.
          </p>
        </div>

        <div className="p-6 rounded-md bg-accent text-accent-foreground flex flex-col justify-center">
          <h3 className="text-xl font-semibold">Accent Color</h3>
          <p>A complementary color for emphasis.</p>
        </div>

        <div className="p-6 rounded-md bg-destructive text-primary-foreground flex flex-col justify-center">
          <h3 className="text-xl font-semibold">Destructive Color</h3>
          <p>For actions like deleting or removing.</p>
        </div>

        <div className="p-6 rounded-md bg-muted text-muted-foreground flex flex-col justify-center">
          <h3 className="text-xl font-semibold">Muted Color</h3>
          <p>For subtle text or backgrounds.</p>
        </div>
      </div>

      <hr className="my-6 border-border" />

      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold mb-2">Sample Card</h3>
        <p className="text-muted-foreground mb-4">
          This is an example of a card, showcasing the background,
          text, and border colors.
        </p>
        <div className="flex space-x-4">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
            Primary Action
          </button>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
            Secondary Action
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Input Field
          </label>
          <input
            type="text"
            placeholder="Enter text..."
            className="mt-1 block w-full rounded-md border-input bg-background p-2 text-foreground focus:border-ring focus:ring-ring outline-none transition-colors"
          />
        </div>

        <div>
          <h4 className="text-lg font-medium text-foreground">
            Ring and Border
          </h4>
          <div className="mt-2 w-full p-4 border border-border rounded-lg focus-within:ring-2 focus-within:ring-ring transition-all">
            This div demonstrates the `border` and `ring` colors.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemePreview;
