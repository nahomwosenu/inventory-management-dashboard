import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { CurrentUser } from "../App";
import { translations } from "../lib/translations";

interface AnnouncementsProps {
  lang: "en" | "am";
  currentUser: CurrentUser;
}

export function Announcements({ lang, currentUser }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const { toast } = useToast();
  const t = translations[lang];

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const { announcements } = await backend.announcement.list();
      setAnnouncements(announcements);
    } catch (error) {
      console.error("Failed to load announcements:", error);
      toast({ title: t.error, description: t.failedToLoadAnnouncements, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await backend.announcement.create({
        ...formData,
        createdBy: currentUser.id,
      });
      
      toast({ title: t.success, description: t.announcementCreated });
      setDialogOpen(false);
      setFormData({ title: "", content: "" });
      loadAnnouncements();
    } catch (error) {
      console.error("Failed to create announcement:", error);
      toast({ title: t.error, description: t.failedToCreateAnnouncement, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t.announcements}</CardTitle>
            <CardDescription>{t.manageAnnouncements}</CardDescription>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t.newAnnouncement}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </span>
              </div>
              <CardDescription>
                {t.by} {announcement.authorName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.newAnnouncement}</DialogTitle>
              <DialogDescription>{t.createAnnouncementDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t.title}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">{t.content}</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t.cancel}</Button>
                <Button type="submit">{t.publish}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
