
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Link, TestTube } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { webhookDispatcher } from '@/utils/webhookEvents';

const WebhookConfig = () => {
  const [webhookUrl, setWebhookUrl] = useState(webhookDispatcher.getWebhookUrl() || '');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const { toast } = useToast();

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid webhook URL",
        variant: "destructive",
      });
      return;
    }

    webhookDispatcher.setWebhookUrl(webhookUrl.trim());
    toast({
      title: "Webhook URL Saved",
      description: "Webhook events will now be sent to this URL",
    });
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "No URL configured",
        description: "Please save a webhook URL first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingWebhook(true);
    
    try {
      // Send a test event
      await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          type: 'test_event',
          timestamp: new Date().toISOString(),
          data: {
            message: 'This is a test webhook from Web3 Radio',
            source: 'web3-radio-app'
          }
        }),
      });

      toast({
        title: "Test webhook sent",
        description: "Check your webhook endpoint to confirm receipt",
      });
    } catch (error) {
      console.error('Test webhook failed:', error);
      toast({
        title: "Test failed",
        description: "Failed to send test webhook",
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <Card className="bg-[#222] border-[#444]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
          <Settings size={16} />
          Thirdweb Webhook Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="webhook-url" className="text-xs text-gray-400">
            Webhook URL
          </Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://your-thirdweb-webhook-url.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="bg-[#333] border-[#555] text-white text-xs"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSaveWebhook}
            size="sm"
            className="flex-1 bg-[#00ff00] text-black hover:bg-[#00cc00] text-xs"
          >
            <Link size={12} className="mr-1" />
            Save
          </Button>
          <Button
            onClick={handleTestWebhook}
            disabled={isTestingWebhook || !webhookUrl.trim()}
            size="sm"
            variant="outline"
            className="bg-[#333] border-[#555] text-gray-300 hover:bg-[#444] text-xs"
          >
            <TestTube size={12} className="mr-1" />
            {isTestingWebhook ? 'Testing...' : 'Test'}
          </Button>
        </div>

        <div className="pt-2 border-t border-[#444]">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333] text-xs">
              Events
            </Badge>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>• wallet_connected - Triggered when wallet connects</div>
            <div>• radio_played - Triggered when radio starts playing</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
