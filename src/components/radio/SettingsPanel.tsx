
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
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase">Stream Config</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="host" className="text-xs">Hostname</Label>
                            <Input id="host" defaultValue="web3radio.cloud" className="h-7 text-xs bg-zinc-900 border-zinc-700" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="port" className="text-xs">Port</Label>
                                <Input id="port" defaultValue="8000" className="h-7 text-xs bg-zinc-900 border-zinc-700" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="pass" className="text-xs">Password</Label>
                                <Input id="pass" type="password" defaultValue="passweb3radio" className="h-7 text-xs bg-zinc-900 border-zinc-700" />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase">Integration</h4>
                    <div className="flex items-center gap-2">
                        <Input placeholder="Discord Webhook URL" className="h-7 text-xs bg-zinc-900 border-zinc-700 flex-1" />
                        <Button size="sm" variant="secondary" className="h-7 px-2 text-xs">Test</Button>
                    </div>
                </div>

                <div className="pt-2">
                    <Button className="w-full h-8 text-xs bg-cyan-600 hover:bg-cyan-700">
                        <Save className="w-3 h-3 mr-2" /> Save Configuration
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
