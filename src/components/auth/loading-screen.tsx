export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-catppuccin-blue select-none">
          <pre className="text-xs leading-tight animate-pulse">
{`╭──────────────────────────────────╮
│  ██████╗ ██████╗ ██████╗ ███████╗ │
│ ██╔════╝██╔═══██╗██╔══██╗██╔════╝ │
│ ██║     ██║   ██║██║  ██║█████╗   │
│ ██║     ██║   ██║██║  ██║██╔══╝   │
│ ╚██████╗╚██████╔╝██████╔╝███████╗ │
│  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝ │
│                                  │
│     ████████╗██████╗  █████╗ ██████╗ │
│     ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝│
│        ██║   ██████╔╝███████║██║     │
│        ██║   ██╔══██╗██╔══██║██║     │
│        ██║   ██║  ██║██║  ██║╚██████╗│
│        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝│
╰──────────────────────────────────╯`}
          </pre>
        </div>
        
        <div className="space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-catppuccin-blue border-t-transparent mx-auto"></div>
          <p className="text-catppuccin-overlay1">Loading CodeTrac...</p>
        </div>
      </div>
    </div>
  );
}