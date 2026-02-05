
import React from 'react';
import { Settings, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SettingsPanel() {
    return (
        <Card className="h-full bg-black/40 backdrop-blur-xl border-zinc-800 text-white shadow-xl">
            <CardHeader className="py-3 px-4 border-b border-zinc-800/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Settings className="w-4 h-4 text-zinc-400" />
                    SETTINGS
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-4">
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs text-zinc-400 space-y-2">
                        <p>
                            This page shows the custom configuration settings that this DNAS server is currently using.
                            (Settings which match DNAS server defaults may not be shown.)
                        </p>
                        <ul className="list-disc pl-4 space-y-1 mt-2">
                            <li>Note #1: To change these values, you will need to edit the <span className="text-zinc-300 font-mono">sc_serv.conf</span> file on your server.</li>
                            <li>Note #2: This is not the same as the actual configuration file.</li>
                        </ul>
                    </div>

                    <Separator className="bg-zinc-800" />

                    <h4 className="text-xs font-semibold text-zinc-500 uppercase">General Settings</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="host" className="text-xs text-zinc-400">Hostname</Label>
                                <Input id="host" defaultValue="localhost" className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-300" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="port" className="text-xs text-zinc-400">PortBase</Label>
                                <Input id="port" defaultValue="8000" className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-300" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="admin_pass" className="text-xs text-zinc-400">AdminPassword</Label>
                            <Input id="admin_pass" defaultValue="web3Radio" className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 font-mono" />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="pass" className="text-xs text-zinc-400">Password</Label>
                            <Input id="pass" defaultValue="Web3RadioXYZ" className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 font-mono" />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="logfile" className="text-xs text-zinc-400">LogFile</Label>
                            <Input id="logfile" defaultValue="sc_serv.log" className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 font-mono" readOnly />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button className="w-full h-9 text-xs bg-cyan-600 hover:bg-cyan-700 transition-colors">
                        <Save className="w-3 h-3 mr-2" /> Save Configuration
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
