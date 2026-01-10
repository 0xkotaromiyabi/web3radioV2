
import React from 'react';
import { Calendar, Clock, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProgramSchedule() {
  const schedule = [
    { time: '08:00 - 10:00', title: 'Morning Show', type: 'LIVE', host: 'DJ Solar' },
    { time: '10:00 - 12:00', title: 'Auto Playlist', type: 'AUTO DJ', host: 'System' },
    { time: '13:00 - 14:00', title: 'Tech Talk', type: 'RECORDED', host: 'Alex W.' },
    { time: '14:00 - 16:00', title: 'Top 40 Hits', type: 'LIVE', host: 'Sarah J.' },
    { time: '16:00 - 18:00', title: 'Sunset Vibes', type: 'AUTO DJ', host: 'System' },
  ];

  return (
    <Card className="h-full bg-black/40 backdrop-blur-xl border-zinc-800 text-white shadow-xl">
      <CardHeader className="py-3 px-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            SCHEDULE
          </CardTitle>
          <Badge variant="outline" className="border-orange-500/30 text-orange-400">TODAY</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-800/50">
          {schedule.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-3 hover:bg-white/5 transition-colors group">
              <div className="min-w-[80px] text-xs font-mono text-zinc-500 pt-1 border-r border-zinc-800 pr-3 text-right">
                {item.time.split('-')[0]}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-zinc-200">{item.title}</span>
                  <Badge className={
                    item.type === 'LIVE' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' :
                      item.type === 'AUTO DJ' ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30' :
                        'bg-zinc-700 text-zinc-400'
                  }>{item.type}</Badge>
                </div>
                <p className="text-xs text-zinc-500 flex items-center gap-1">
                  Run by: <span className="text-zinc-400">{item.host}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
