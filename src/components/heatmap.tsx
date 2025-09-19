import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface HeatmapProps {
  data: { date: string; count: number; level: number }[];
}

export function Heatmap({ data }: HeatmapProps) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364); // Show last 365 days

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Generate all dates for the past year
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    currentWeek.push(new Date(d));
    
    if (d.getDay() === 6 || d.getTime() === today.getTime()) { // Saturday or last day
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  const getActivityLevel = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    const activity = data.find(d => d.date === dateStr);
    return activity?.level || 0;
  };

  const getActivityCount = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    const activity = data.find(d => d.date === dateStr);
    return activity?.count || 0;
  };

  const getLevelColor = (level: number): string => {
    switch (level) {
      case 0: return 'bg-catppuccin-surface1';
      case 1: return 'bg-catppuccin-green/30';
      case 2: return 'bg-catppuccin-green/60';
      case 3: return 'bg-catppuccin-green/80';
      case 4: return 'bg-catppuccin-green';
      default: return 'bg-catppuccin-surface1';
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-catppuccin-surface0 p-6 rounded-lg border border-catppuccin-surface1">
      <h3 className="text-lg font-semibold text-catppuccin-blue mb-4">Activity Heatmap</h3>
      
      <div className="space-y-3">
        {/* Month labels */}
        <div className="flex justify-between text-xs text-catppuccin-overlay1 ml-8">
          {months.map((month, i) => (
            <span key={i}>{month}</span>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col space-y-1 mr-2">
            {days.map((day, i) => (
              <div key={i} className="text-xs text-catppuccin-overlay1 h-3 flex items-center">
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <TooltipProvider>
            <div className="flex space-x-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-1">
                  {week.map((date, dayIndex) => {
                    const level = getActivityLevel(date);
                    const count = getActivityCount(date);
                    
                    return (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-3 h-3 rounded-sm ${getLevelColor(level)} hover:ring-2 hover:ring-catppuccin-blue/50 transition-all cursor-pointer`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">
                            {count} problems on {date.toLocaleDateString()}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-xs text-catppuccin-overlay1">
            <span>Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
          
          <div className="text-xs text-catppuccin-overlay1">
            Total: {data.reduce((sum, d) => sum + d.count, 0)} problems solved this year
          </div>
        </div>
      </div>
    </div>
  );
}