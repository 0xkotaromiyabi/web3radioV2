import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Calendar, Radio, Image, TrendingUp, Clock, Sparkles } from "lucide-react";

interface DashboardOverviewProps {
    newsCount: number;
    eventsCount: number;
    stationsCount: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    newsCount,
    eventsCount,
    stationsCount
}) => {
    const stats = [
        {
            title: "Total Articles",
            value: newsCount,
            icon: Newspaper,
            gradient: "from-blue-500 to-blue-600",
            bgGradient: "from-blue-500/10 to-blue-600/10"
        },
        {
            title: "Upcoming Events",
            value: eventsCount,
            icon: Calendar,
            gradient: "from-purple-500 to-purple-600",
            bgGradient: "from-purple-500/10 to-purple-600/10"
        },
        {
            title: "Radio Stations",
            value: stationsCount,
            icon: Radio,
            gradient: "from-green-500 to-green-600",
            bgGradient: "from-green-500/10 to-green-600/10"
        },
        {
            title: "Media Files",
            value: 0,
            icon: Image,
            gradient: "from-orange-500 to-orange-600",
            bgGradient: "from-orange-500/10 to-orange-600/10"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="panel-float p-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-apple">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Welcome to Web3Radio</h1>
                        <p className="text-muted-foreground">Manage your content, media, and radio stations.</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="card-apple p-6 hover-lift cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}>
                                <stat.icon className={`h-5 w-5 bg-gradient-to-r ${stat.gradient} bg-clip-text text-blue-500`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                            <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-apple">
                    <div className="p-6 border-b border-border/30">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-medium text-foreground">Recent Activity</h3>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-foreground flex-1">Dashboard loaded successfully</span>
                            <span className="text-xs text-muted-foreground">Just now</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-sm text-foreground flex-1">Local database connected</span>
                            <span className="text-xs text-muted-foreground">Today</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span className="text-sm text-foreground flex-1">Docker containers running</span>
                            <span className="text-xs text-muted-foreground">Today</span>
                        </div>
                    </div>
                </div>

                <div className="card-apple">
                    <div className="p-6 border-b border-border/30">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-medium text-foreground">Quick Tips</h3>
                        </div>
                    </div>
                    <div className="p-6 space-y-3">
                        <p className="text-sm text-muted-foreground">
                            • Use <span className="text-blue-500 font-medium">News</span> to publish articles
                        </p>
                        <p className="text-sm text-muted-foreground">
                            • <span className="text-blue-500 font-medium">Media Library</span> stores uploaded images
                        </p>
                        <p className="text-sm text-muted-foreground">
                            • Add <span className="text-blue-500 font-medium">Events</span> to inform your audience
                        </p>
                        <p className="text-sm text-muted-foreground">
                            • Manage <span className="text-blue-500 font-medium">Radio Stations</span> status
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
