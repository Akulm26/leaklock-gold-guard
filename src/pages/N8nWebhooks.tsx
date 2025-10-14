import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Webhook, Trash2, Plus } from "lucide-react";

interface N8nWebhook {
  id: string;
  webhook_name: string;
  webhook_url: string;
  event_type: string;
  is_active: boolean;
}

export default function N8nWebhooks() {
  const [webhooks, setWebhooks] = useState<N8nWebhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    webhook_name: "",
    webhook_url: "http://localhost:5678/webhook/2d1e4b18-9694-46c9-9e0b-57f643e3b2da",
    event_type: "subscription_added",
  });

  const eventTypes = [
    { value: "subscription_added", label: "Subscription Added" },
    { value: "subscription_updated", label: "Subscription Updated" },
    { value: "subscription_deleted", label: "Subscription Deleted" },
    { value: "subscription_renewed", label: "Subscription Renewed" },
    { value: "payment_reminder", label: "Payment Reminder" },
  ];

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("n8n_webhooks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error("Error loading webhooks:", error);
      toast.error("Failed to load webhooks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebhook = async () => {
    if (!newWebhook.webhook_name || !newWebhook.webhook_url) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("n8n_webhooks").insert({
        user_id: user.id,
        webhook_name: newWebhook.webhook_name,
        webhook_url: newWebhook.webhook_url,
        event_type: newWebhook.event_type,
      });

      if (error) throw error;

      toast.success("Webhook added successfully");
      setNewWebhook({ webhook_name: "", webhook_url: "", event_type: "subscription_added" });
      setShowAddForm(false);
      loadWebhooks();
    } catch (error) {
      console.error("Error adding webhook:", error);
      toast.error("Failed to add webhook");
    }
  };

  const handleToggleWebhook = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("n8n_webhooks")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Webhook ${!isActive ? "enabled" : "disabled"}`);
      loadWebhooks();
    } catch (error) {
      console.error("Error toggling webhook:", error);
      toast.error("Failed to update webhook");
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const { error } = await supabase.from("n8n_webhooks").delete().eq("id", id);

      if (error) throw error;

      toast.success("Webhook deleted");
      loadWebhooks();
    } catch (error) {
      console.error("Error deleting webhook:", error);
      toast.error("Failed to delete webhook");
    }
  };

  return (
    <MobileLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold">n8n Webhooks</h1>
            <p className="text-sm text-muted-foreground">Automate subscription workflows</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="w-full">
            <Plus className="mr-2" size={20} />
            Add Webhook
          </Button>
        )}

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add n8n Webhook</CardTitle>
              <CardDescription>
                Connect your n8n workflow to automate subscription events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook_name">Webhook Name</Label>
                <Input
                  id="webhook_name"
                  placeholder="My Workflow"
                  value={newWebhook.webhook_name}
                  onChange={(e) =>
                    setNewWebhook({ ...newWebhook, webhook_name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  placeholder="https://your-n8n-instance.com/webhook/..."
                  value={newWebhook.webhook_url}
                  onChange={(e) =>
                    setNewWebhook({ ...newWebhook, webhook_url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <Select
                  value={newWebhook.event_type}
                  onValueChange={(value) =>
                    setNewWebhook({ ...newWebhook, event_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddWebhook} className="flex-1">
                  Add Webhook
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewWebhook({
                      webhook_name: "",
                      webhook_url: "",
                      event_type: "subscription_added",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading webhooks...</div>
        ) : webhooks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Webhook className="mx-auto mb-4 opacity-50" size={48} />
              <p>No webhooks configured yet</p>
              <p className="text-sm">Add your first webhook to start automating</p>
            </CardContent>
          </Card>
        ) : (
          webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Webhook size={20} className="text-muted-foreground" />
                    <h3 className="font-semibold">{webhook.webhook_name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={webhook.is_active}
                      onCheckedChange={() =>
                        handleToggleWebhook(webhook.id, webhook.is_active)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      <Trash2 size={18} className="text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {eventTypes.find((t) => t.value === webhook.event_type)?.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {webhook.webhook_url}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </MobileLayout>
  );
}
